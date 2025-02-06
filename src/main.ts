import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { AllExceptionsFilter } from './common/exceptions/base.exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 注册全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 注册全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  // 注册全局验证管道
  app.useGlobalPipes(new ValidationPipe());

  // 配置 Swagger
  const config = new DocumentBuilder()
    .setTitle('在线代码运行 API')
    .setDescription('在线代码运行系统的 API 文档')
    .setVersion('1.0')
    .addTag('code-runner')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
