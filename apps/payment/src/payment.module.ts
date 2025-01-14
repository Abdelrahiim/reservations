import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule, Queues, Services } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

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

        NOTIFICATION_SERVICE_HOST: Joi.string().required(),
        NOTIFICATION_SERVICE_PORT: Joi.number().required(),
      }),
    }),
    LoggerModule,
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: (config: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [config.getOrThrow<string>('RABBITMQ_URL')],
              queue: Queues.NOTIFICATIONS,
            },
          }),
          name: Services.NOTIFICATIONS,
          inject: [ConfigService],
        },
      ],
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
