import { UserDocument } from '@app/common';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as becrypt from 'bcryptjs';
import { TokenPayload } from './interface/token-payload.interface';
import { RedisService } from '@app/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Logs in a user and generates access and refresh tokens.
   * @param user - The user object to log in.
   * @param res - The response object to set cookies on.
   * @returns An object containing the user data.
   */
  public async login(user: UserDocument, res: Response) {
    const {
      accessToken,
      refreshToken,
      expiresAccessToken,
      expiresRefreshToken,
    } = this.generateTokens(user);
    const refreshTokenHash = await becrypt.hash(refreshToken, 10);

    this.redisService.set(
      `refreshToken:${user._id.toString()}`,
      refreshTokenHash,
    );

    res.cookie('Authorization', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      path: '/',
      expires: expiresAccessToken,
    });

    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      path: '/',
      expires: expiresRefreshToken,
    });

    return user;
  }

  /**
   * Verifies a refresh token. If the token is invalid, it throws an UnauthorizedException.
   * @param refreshToken The refresh token to verify.
   * @param userId The user ID that the refresh token belongs to.
   * @returns The user object if the token is valid.
   */
  public async verifyRefreshToken(refreshToken: string, userId: string) {
    try {
      const user = await this.usersService.getUserById(userId);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const hashedRefreshToken = await this.redisService.get(
        `refreshToken:${userId}`,
      );
      if (!hashedRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const isValid = await becrypt.compare(refreshToken, hashedRefreshToken);

      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      delete user.password;
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Generates access and refresh tokens for a user.
   * @param user - The user object to generate tokens for.
   * @returns An object containing the generated access and refresh tokens and their expiration dates.
   */
  private generateTokens(user: UserDocument) {
    const tokenPayload: TokenPayload = { sub: user._id.toString() };
    const accessTokenData = this.generateAccessToken(tokenPayload);
    const refreshTokenData = this.generateRefreshToken(tokenPayload);

    return {
      ...accessTokenData,
      ...refreshTokenData,
    };
  }

  /**
   * Generates an access token and its expiration date.
   * @param tokenPayload - The payload to include in the access token.
   * @returns An object containing the generated access token and its expiration date.
   */
  private generateAccessToken(tokenPayload: TokenPayload) {
    const expiresAccessToken = new Date(
      Date.now() +
        parseInt(this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION')) *
          1000,
    );
    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET_KEY'),
      expiresIn: `${this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION')}s`,
    });

    return { accessToken, expiresAccessToken };
  }

  /**
   * Generates a refresh token and its expiration date.
   * @param tokenPayload payload for the refresh token
   * @returns an object with the refresh token and its expiration date
   */
  private generateRefreshToken(tokenPayload: TokenPayload) {
    const expiresRefreshToken = new Date(
      Date.now() +
        parseInt(
          this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION'),
        ) *
          1000,
    );
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: `${this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION')}s`,
    });

    return { refreshToken, expiresRefreshToken };
  }
}
