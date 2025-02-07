import { ApiProperty } from '@nestjs/swagger';

export class CommonResponseDto<T> {
  @ApiProperty({ description: '返回数据' })
  data: T;

  @ApiProperty({ description: '状态码', example: 0 })
  status: number;

  @ApiProperty({ description: '提示信息', example: 'success' })
  message: string;

  @ApiProperty({ description: '是否成功', example: true })
  success: boolean;
}
