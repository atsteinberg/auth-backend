import { ForbiddenException, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/signup.dto';
import { Tokens } from './types/tokens.type';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  hashData(data: string) {
    return hash(data, 10);
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([this.jwtService.signAsync({
      sub: userId,
      email,
    }, {
      expiresIn: '15min',
      secret: this.configService.get('JWT_AT_SECRET'),
    }),
    this.jwtService.signAsync({
      sub: userId,
      email,
    }, {
      expiresIn: '1week',
      secret: this.configService.get('JWT_RT_SECRET'),
    }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRtHash(userId: number, rt: string) {
    const hashedRt = await this.hashData(rt);
    await this.prismaService.user.update({
      where: {
        userId,
      },
      data: {
        hashedRt,
      },
    });
  }

  async signupLocal(dto: SignupDto): Promise<Tokens> {
    const hashedPassword = await this.hashData(dto.password);
    try {
      const newUser = await this.prismaService.user.create({
        data: {
          userName: dto.userName,
          email: dto.email,
          hashedPassword,
        },
      });
      const tokens = await this.getTokens(newUser.userId, newUser.email);
      await this.updateRtHash(newUser.userId, tokens.refresh_token);

      return tokens;
    } catch (error) {
      throw new ForbiddenException('could not signup user');
    }
  }

  async signinLocal(dto: SigninDto): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('no user with that email and password found');
    }

    const passwordMatches = await compare(dto.password, user.hashedPassword);

    if (!passwordMatches) {
      throw new ForbiddenException('no user with that email and password found');
    }

    const tokens = await this.getTokens(user.userId, user.email);
    await this.updateRtHash(user.userId, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    await this.prismaService.user.updateMany({
      where: {
        userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        userId,
      },
    });
    if (!user || !user.hashedRt) {
      throw new ForbiddenException('access denied');
    }

    const rtsMatch = await compare(rt, user.hashedRt);
    if (!rtsMatch) {
      throw new ForbiddenException('access denied');
    }
    const tokens = await this.getTokens(user.userId, user.email);
    await this.updateRtHash(user.userId, tokens.refresh_token);

    return tokens;
  }
}
