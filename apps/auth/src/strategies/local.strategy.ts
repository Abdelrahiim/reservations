import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(private readonly userService: UsersService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    try {
      return await this.userService.verifyUser(email, password);
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
