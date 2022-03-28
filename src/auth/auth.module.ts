import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAtStrategy } from './strategies/jwt.at.strategy';
import { AuthController } from './auth.controller';
import { JwtRtStrategy } from './strategies/jwt.rt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, JwtAtStrategy, JwtRtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
