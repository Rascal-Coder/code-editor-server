import { Injectable } from '@nestjs/common';
import { CodeType } from '@/constants/docker.constant';
import { run } from './docker';
import { RunCodeResponseDto } from './dto/run-code-response.dto';

@Injectable()
export class CodeRunnerService {
  async runCode(params: {
    type: CodeType;
    code: string;
    stdin?: string;
    version?: string;
  }): Promise<RunCodeResponseDto> {
    const output = (await run(params)) as string;

    return { output: output };
  }
}
