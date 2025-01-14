import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { Queues } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);

  app.useLogger(app.get(Logger));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
      queue: Queues.NOTIFICATIONS,
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
