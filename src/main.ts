import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  const configService = app.get(ConfigService);

  const host = configService.get('APP_HOST') || '0.0.0.0';
  const port = +configService.get('APP_PORT') || 3001;
  const origin = configService.get('CLIENT_DOMAIN') || '';

  app.enableCors({
    origin,
    credentials: true,
  });
  await app.listen(port, host);
  console.log(`🚀 server launched at ${await app.getUrl()}`); // eslint-disable-line no-console
}
bootstrap();
