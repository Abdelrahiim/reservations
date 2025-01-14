import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, UserDto } from '@app/common';
import { UserDocument } from '@app/common';
import { Response } from 'express';
import { LocalAuthGuard, JwtRefreshGuard, JwtAuthGuard } from './guards';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Messages } from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  public health() {
    return 'ok';
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  public async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(user, res);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(user, res);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern(Messages.AUTHENTICATE)
  async authenticate(@Payload() payload: { user: UserDto }) {
    return payload.user;
  }
}
