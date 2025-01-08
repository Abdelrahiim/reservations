import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as joi from 'joi';
@Module({
  imports: [
    NestConfigModule.forRoot({
      validationSchema: joi.object({
        MONGODB_URI: joi.string().uri().required(),
      }),
    }),
  ],
})
export class ConfigModule {}
