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

  async getTokens(userId: string, email: string, version: number) {
    const [accessToken, refreshToken] = await Promise.all([this.jwtService.signAsync({
      sub: userId,
      email,
    }, {
      expiresIn: this.configService.get('JWT_AT_EXPIRATION_OFFSET'),
      secret: this.configService.get('JWT_AT_SECRET'),
    }),
    this.jwtService.signAsync({
      version,
      sub: userId,
      email,
    }, {
      expiresIn: +this.configService.get('RT_EXPIRATION_OFFSET'),
      secret: this.configService.get('JWT_RT_SECRET'),
    }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRtHash(userId: string, rt: string, oldRt?: string) {
    const hashedRt = await this.hashData(rt);
    if (oldRt !== undefined) {
      await this.prismaService.user.update({
        where: {
          userId,
        },
        data: {
          hashedRt,
          oldRts: {
            push: oldRt,
          },
        },
      });
    } else {
      await this.prismaService.user.update({
        where: {
          userId,
        },
        data: {
          hashedRt,
          oldRts: [],
        },
      });
    }
  }

  async signupLocal(dto: SignupDto): Promise<Tokens> {
    const hashedPassword = await this.hashData(dto.password);
    try {
      const newUser = await this.prismaService.user.create({
        data: {
          userName: dto.userName,
          email: dto.email,
          hashedPassword,
          oldRts: [],
        },
      });
      const tokens = await this.getTokens(newUser.userId, newUser.email, 0);
      await this.updateRtHash(newUser.userId, tokens.refreshToken);

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

    const tokens = await this.getTokens(user.userId, user.email, user.oldRts.length);
    await this.updateRtHash(user.userId, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.prismaService.user.updateMany({
      where: {
        userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
        oldRts: [],
      },
    });
  }

  async refreshTokens(userId: string, rt: string) {
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
      const matchesOldRt = await Promise.all(user.oldRts.map((oldRt) => compare(rt, oldRt)));
      if (matchesOldRt.some((match) => match === true)) {
        await this.prismaService.user.update({
          where: {
            userId: user.userId,
          },
          data: {
            hashedRt: null,
            oldRts: [],
          },
        });
      }
      throw new ForbiddenException('access denied');
    }
    const tokens = await this.getTokens(user.userId, user.email, user.oldRts.length);
    await this.updateRtHash(user.userId, tokens.refreshToken, user.hashedRt);

    return tokens;
  }
}
