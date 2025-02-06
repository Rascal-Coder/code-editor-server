import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CodeType } from '@/constants/docker.constant';

export class RunCodeDto {
  @ApiProperty({ enum: CodeType, description: '编程语言类型' })
  @IsEnum(CodeType)
  @IsNotEmpty()
  type: CodeType;

  @ApiProperty({ description: '代码内容' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: '标准输入' })
  @IsString()
  @IsOptional()
  stdin?: string;

  @ApiPropertyOptional({ description: '语言版本，如不指定则使用默认版本' })
  @IsString()
  @IsOptional()
  version?: string;
}
