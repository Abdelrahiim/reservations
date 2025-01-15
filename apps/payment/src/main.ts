import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { PAYMENT_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PaymentModule,
    {
      transport: Transport.GRPC,
      options: {
        package: PAYMENT_PACKAGE_NAME,
        protoPath: join(__dirname, '../../../proto/payment.proto'),
        url: process.env.PAYMENT_GRPC_SERVICE_URL,
      },
    },
  );

  app.useLogger(app.get(Logger));
  await app.listen();
}

bootstrap();
