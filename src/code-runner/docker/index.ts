import Docker, { Container } from 'dockerode';
import dockerConfig from '@/config/docker';
import { isType } from '@/utils/helper';
import {
  CodeEnv,
  CodeType,
  imageMap,
  defaultVersion,
} from '@/constants/docker.constant';
import { BusinessException } from '@/common/exceptions/business.exception';

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

  let dockerOptions = imageMap[image];

  if (!dockerOptions) {
    dockerOptions = imageMap[type];
  }

  const { shellWithStdin, fileSuffix, prefix = '', shell } = dockerOptions;

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
      function (_err, container?: Container) {
        if (_err) reject(_err);
        removeContainer = async () => {
          await container?.remove({ force: true });
        };

        container?.start((_err) => {
          if (_err) {
            removeContainer();
            reject(_err);
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
              outputString = formatOutput(outputString);

              const containerInfo = await container?.inspect();
              const isRunning = containerInfo.State.Running;

              const isTimeout = !!isRunning;
              if (isTimeout) {
                BusinessException.throwTimeout();
              }
            } catch (error) {
              removeContainer();
              reject(error);
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

function formatOutput(outputString: string): string {
  if (outputString.length > 8200) {
    outputString =
      outputString.slice(0, 4000) +
      outputString.slice(outputString.length - 4000);
  }

  if (isType('Object', 'Array')(outputString)) {
    outputString = JSON.stringify(outputString);
  }

  if (typeof outputString !== 'string') {
    outputString = String(outputString);
  }

  let outputStringArr = outputString.split('%0A');

  if (outputStringArr.length > 200) {
    outputStringArr = outputStringArr
      .slice(0, 100)
      .concat(
        ['%0A', '...' + encodeURI('数据太多,已折叠'), '%0A'],
        outputStringArr.slice(outputStringArr.length - 100),
      );
  }

  return outputStringArr.join('%0A');
}
