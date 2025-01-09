import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule, LoggerModule, RedisModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LocalStrategy, JwtStrategy, JwtRefreshStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string(),
        PORT: Joi.number().required(),
      }),
    }),
    RedisModule,
    UsersModule,
    DatabaseModule,
    LoggerModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
