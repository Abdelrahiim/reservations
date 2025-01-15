import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import {
  LoggerModule,
  NOTIFICATIONS_PACKAGE_NAME,
  NOTIFICATIONS_SERVICE_NAME,
} from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

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

        NOTIFICATION_GRPC_SERVICE_URL: Joi.string().required(),
      }),
    }),
    LoggerModule,
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: (config: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: NOTIFICATIONS_PACKAGE_NAME,
              protoPath: join(__dirname, '../../../proto/notifications.proto'),
              url: config.get('NOTIFICATION_GRPC_SERVICE_URL'),
            },
          }),
          name: NOTIFICATIONS_SERVICE_NAME,
          inject: [ConfigService],
        },
      ],
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
