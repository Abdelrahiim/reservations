import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Services, DatabaseModule, Queues } from '@app/common';
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservation.schema';
import { ReservationRepository } from './reservation.repository';
import { LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule, // to connect to database
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]), // to get specific model,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        AUTH_SERVICE_HOST: Joi.string().required(),
        AUTH_SERVICE_PORT: Joi.number().required(),
        PAYMENT_SERVICE_HOST: Joi.string().required(),
        PAYMENT_SERVICE_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
              queue: Queues.AUTH,
            },
          }),
          name: Services.AUTH,
          inject: [ConfigService],
        },
        {
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
              queue: Queues.PAYMENT,
            },
          }),
          name: Services.PAYMENT,
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository],
})
export class ReservationModule {}
