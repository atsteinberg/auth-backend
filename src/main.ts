import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors();
  await app.listen(3001, '0.0.0.0');
  console.log(`🚀 server launched at ${await app.getUrl()}`); // eslint-disable-line no-console
}
bootstrap();
