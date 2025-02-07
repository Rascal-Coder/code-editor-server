import { Injectable } from '@nestjs/common';
import { CodeType } from '@/constants/docker.constant';
import { run } from './docker';
import { RunCodeOutput } from './dto/run-code-response.dto';

@Injectable()
export class CodeRunnerService {
  async runCode(params: {
    type: CodeType;
    code: string;
    stdin?: string;
    version?: string;
  }): Promise<RunCodeOutput> {
    const output = (await run(params)) as string;
    return { output: output };
  }
}
