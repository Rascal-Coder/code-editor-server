import { Injectable } from '@nestjs/common';
import { CodeType } from '@/constants/docker.constant';
import { run, RunCodeStatus } from './docker';
import { RunCodeResponseDto } from './dto/run-code-response.dto';

interface DockerRunResult {
  output: string;
  code: RunCodeStatus;
  time: number;
  message: string;
}

@Injectable()
export class CodeRunnerService {
  async runCode(params: {
    type: CodeType;
    code: string;
    stdin?: string;
    version?: string;
  }): Promise<RunCodeResponseDto> {
    const { output } = (await run(params)) as DockerRunResult;

    return { output: output };
  }
}
