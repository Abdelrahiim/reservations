import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import {
  DatabaseModule,
  AUTH_PACKAGE_NAME,
  PAYMENT_PACKAGE_NAME,
  PAYMENT_SERVICE_NAME,
  AUTH_SERVICE_NAME,
} from '@app/common';
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservation.schema';
import { ReservationRepository } from './reservation.repository';
import { LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

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
        AUTH_GRPC_SERVICE_URL: Joi.string().required(),
        PAYMENT_GRPC_SERVICE_URL: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: AUTH_PACKAGE_NAME,
              protoPath: join(__dirname, '../../../proto/auth.proto'),
              url: configService.get('AUTH_GRPC_SERVICE_URL'),
            },
          }),
          name: AUTH_SERVICE_NAME,
          inject: [ConfigService],
        },
        {
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: PAYMENT_PACKAGE_NAME,
              protoPath: join(__dirname, '../../../proto/payment.proto'),
              url: configService.get('PAYMENT_GRPC_SERVICE_URL'),
            },
          }),
          name: PAYMENT_SERVICE_NAME,
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
