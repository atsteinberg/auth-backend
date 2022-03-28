import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001, '0.0.0.0');
  console.log(`🚀 server launched at ${await app.getUrl()}`); // eslint-disable-line no-console
}
bootstrap();
