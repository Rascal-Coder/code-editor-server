import { Controller, Post, Body } from '@nestjs/common';
import { CodeRunnerService } from './code-runner.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RunCodeDto } from './dto/run-code.dto';
import { RunCodeResponseDto, RunCodeOutput } from './dto/run-code-response.dto';

@ApiTags('code-runner')
@Controller('code-runner')
export class CodeRunnerController {
  constructor(private readonly codeRunnerService: CodeRunnerService) {}

  @Post('run')
  @ApiOperation({
    summary: '运行代码',
    description: '运行指定语言的代码并返回执行结果',
  })
  @ApiResponse({
    status: 200,
    description: '运行成功',
    type: RunCodeResponseDto,
  })
  async runCode(@Body() params: RunCodeDto): Promise<RunCodeOutput> {
    return await this.codeRunnerService.runCode(params);
  }
}
