import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { Queues } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const configService = app.get(ConfigService);

  app.useLogger(app.get(Logger));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
      queue: Queues.PAYMENT,
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
