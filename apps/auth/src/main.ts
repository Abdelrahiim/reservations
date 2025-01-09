import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  // Get configuration service
  const configService = app.get(ConfigService);
  // Configure microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
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
