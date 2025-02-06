import { ApiProperty } from '@nestjs/swagger';

export class RunCodeResponseDto {
  @ApiProperty({ description: '程序输出' })
  output: string;
}
