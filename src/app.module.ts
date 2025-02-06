import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeRunnerModule } from './code-runner/code-runner.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';

@Module({
  imports: [CodeRunnerModule, WinstonModule.forRoot(winstonConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
