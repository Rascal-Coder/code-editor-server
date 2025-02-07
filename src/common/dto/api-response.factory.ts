import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from './common-response.dto';

export function ApiResponseDto<T>(DataDto: Type<T>) {
  class ApiResponseClass extends CommonResponseDto<T> {
    @ApiProperty({ type: DataDto })
    declare data: T;
  }

  return ApiResponseClass;
}
