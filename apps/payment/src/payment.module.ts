import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        TCP_PORT: Joi.number().optional(),
        PAYMOB_API_KEY: Joi.string().optional(),
        PAYMOB_SECRET_KEY: Joi.string().optional(),
        PAYMOB_PUBLIC_KEY: Joi.string().optional(),
        PAYMOB_INTEGRATION_ID: Joi.string().optional(),
        PAYMOB_API_URL: Joi.string().optional(),

        STRIPE_SECRET_KEY: Joi.string().required(),
        STRIPE_PUBLIC_KEY: Joi.string().required(),
      }),
    }),
    LoggerModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
