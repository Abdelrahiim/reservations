import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interface/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => req?.cookies?.Authorization || req?.Authorization,
      ]),
      secretOrKey: _configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET_KEY'),
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.usersService.getUserById(payload.sub);
    delete user.password;
    return user;
  }
}
