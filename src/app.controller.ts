import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BusinessException } from './common/exceptions/business.exception';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('business-error')
  findBusinessError() {
    const a: any = {};
    try {
      console.log(a.b.c);
    } catch {
      throw new BusinessException('你这个参数错了');
    }
    return 'ok';
  }
}
