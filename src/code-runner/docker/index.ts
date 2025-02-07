import Docker, { Container } from 'dockerode';
import dockerConfig from '@/config/docker';
import { formatDockerOutput } from '@/utils';
import { CodeEnv, CodeType, defaultVersion } from '@/constants/docker.constant';
import { BusinessException } from '@/common/exceptions/business.exception';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DockerRunConfig = {
  timeout: 6000,
};

export enum DockerRunStatus {
  running = 'running',
  exited = 'exited',
}

const docker = new Docker({
  ...dockerConfig,
});

export async function run(params: {
  type: CodeType;
  code: string;
  stdin?: string;
  version?: string;
}) {
  const { code, type, stdin } = params;

  let { version } = params;

  const codeEnv = CodeEnv[type];

  if (!version) {
    version = defaultVersion[codeEnv];
  }

  let image = `${codeEnv}:${version}`;

  if (type === CodeType.ts) {
    image = `${CodeEnv.nodejs}:18`;
  }

  // 从数据库获取配置
  let dockerOptions = await prisma.codeRunnerConfig.findFirst({
    where: {
      language: image,
    },
  });
  if (!dockerOptions) {
    // 找不到特定版本的配置，使用通用配置
    dockerOptions = await prisma.codeRunnerConfig.findFirst({
      where: {
        language: type,
      },
    });
  }

  const {
    shell,
    shellWithStdin,
    fileSuffix,
    prefix = '',
  } = dockerOptions || {};

  let removeContainer = () => {};

  const wrapCode = '\n' + prefix + decodeURI(code) + '\n' + 'EOF' + '\n';
  const wrapStdin = '\n' + decodeURI(stdin || '') + '\n' + 'EOF' + '\n';

  let bashCmd = `cat > code.${fileSuffix} << 'EOF' ${wrapCode}`;

  if (type === CodeType.java) {
    bashCmd = `cat > Code.${fileSuffix} << 'EOF' ${wrapCode}`;
  }

  if (stdin) {
    bashCmd += `cat > input.txt << EOF ${wrapStdin}
    ${shellWithStdin}`;
  } else {
    bashCmd += `${shell}`;
  }

  return await new Promise((resolve, reject) => {
    docker.createContainer(
      {
        Image: image,
        Cmd: ['bash', '-c', bashCmd],
        StopTimeout: 6,
        Tty: true,
        AttachStdout: true,
        NetworkDisabled: true,
      },
      (err: Error, container?: Container) => {
        if (err)
          reject(new BusinessException(`Docker execution failed: ${err}`));
        removeContainer = async () => {
          await container?.remove({ force: true });
        };

        container?.start((err: Error) => {
          if (err) {
            removeContainer();
            reject(new BusinessException(`Docker execution failed:${err}`));
          }
          const handleOutput = async () => {
            let outputString = '';
            try {
              outputString = await container?.logs({
                stdout: true,
                stderr: true,
              });

              if (Buffer.isBuffer(outputString)) {
                outputString = outputString.toString('utf-8');
              }
              outputString = formatDockerOutput(outputString);

              const containerInfo = await container?.inspect();
              const isRunning = containerInfo.State.Running;

              const isTimeout = !!isRunning;
              if (isTimeout) {
                BusinessException.throwTimeout();
              }
            } catch (error) {
              removeContainer();
              reject(new BusinessException(`Docker execution failed:${error}`));
            } finally {
              removeContainer();
              resolve(outputString);
            }
          };

          container?.attach(
            { stream: true, stdout: true, stderr: true },
            function (_err: any, stream: any) {
              stream?.pipe(process.stdout as any);
            },
          );

          const timeoutSig = setTimeout(handleOutput, DockerRunConfig.timeout);

          container?.wait((status) => {
            if (!status || status?.Status === DockerRunStatus.exited) {
              clearTimeout(timeoutSig);
              handleOutput();
            }
          });
        });
      },
    );
  });
}
