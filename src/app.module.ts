import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAtGuard } from './common/guards/jwt-at.guard';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({
    isGlobal: true,
  }), CustomersModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: JwtAtGuard,
  }],
})
export class AppModule {}
