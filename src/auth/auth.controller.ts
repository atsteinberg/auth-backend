import {
  Controller, Body, Post, HttpCode, HttpStatus, Res, UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';
import { NoAtRequired } from 'src/common/decorators/no-at-required.decorator';
import { RefreshToken } from 'src/common/decorators/refresh-token.decorator';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { JwtRtGuard } from 'src/common/guards/jwt-rt.guard';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { AccessToken } from './types/tokens.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  cookieOptions: CookieOptions = {
    httpOnly: true,
    domain: this.configService.get('CLIENT_DOMAIN') || 'localhost',
    expires: new Date(Date.now() + (+this.configService.get('RT_EXPIRATION_OFFSET') || 1000 * 60 * 60 * 24)),
  };

  @NoAtRequired()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(
    @Body() dto: SignupDto,
      @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { accessToken, refreshToken } = await this.authService.signupLocal(dto);
    response.cookie('refresh_token', refreshToken, this.cookieOptions);
    return { access_token: accessToken };
  }

  @NoAtRequired()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Body() dto: SigninDto,
      @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { accessToken, refreshToken } = await this.authService.signinLocal(dto);
    response.cookie('refresh_token', refreshToken, this.cookieOptions);
    return { access_token: accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@UserId() id: string) {
    return this.authService.logout(id);
  }

  @NoAtRequired()
  @UseGuards(JwtRtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @UserId() id: string,
      @RefreshToken() rt: string,
      @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(id, rt);
    response.cookie('refresh_token', refreshToken, this.cookieOptions);
    return { access_token: accessToken };
  }
}
