import {
  Controller, Body, Post, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { NoAtRequired } from 'src/common/decorators/no-at-required.decorator';
import { RefreshToken } from 'src/common/decorators/refresh-token.decorator';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { JwtRtGuard } from 'src/common/guards/jwt-rt.guard';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { Tokens } from './types/tokens.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @NoAtRequired()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(@Body() dto: SignupDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @NoAtRequired()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(@Body() dto: SigninDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@UserId() id: number) {
    return this.authService.logout(id);
  }

  @NoAtRequired()
  @UseGuards(JwtRtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@UserId() id: number, @RefreshToken() rt: string) {
    return this.authService.refreshTokens(id, rt);
  }
}
