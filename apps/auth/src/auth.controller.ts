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
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  CurrentUser,
  UserMessage,
} from '@app/common';
import { UserDocument } from '@app/common';
import { Response } from 'express';
import { LocalAuthGuard, JwtRefreshGuard, JwtAuthGuard } from './guards';
import { Observable } from 'rxjs';

@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
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
  public authenticate(
    data: any,
  ): Promise<UserMessage> | Observable<UserMessage> | UserMessage {
    console.log({ data });
    return {
      ...data.user,
      id: data.user._id,
    };
  }
}
