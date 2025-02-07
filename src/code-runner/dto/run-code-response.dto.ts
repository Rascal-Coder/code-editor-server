import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@/common/dto/api-response.factory';

export class RunCodeOutput {
  @ApiProperty({ description: '代码执行输出' })
  output: string;
}

export class RunCodeResponseDto extends ApiResponseDto(RunCodeOutput) {}
