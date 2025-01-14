import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Queues } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  // Get configuration service
  const configService = app.get(ConfigService);
  // Configure microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
      queue: Queues.AUTH,
    },
  });

  // Use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Use logger
  app.useLogger(app.get(Logger));

  // Use cookie parser
  app.use(cookieParser());

  app.startAllMicroservices();
  // Start the application
  await app.listen(configService.get('HTTP_PORT'));
}

bootstrap();
