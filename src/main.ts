import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Trust the platform's reverse proxy (Render/Railway/Fly/etc.) so that
  // req.ip reflects the real client IP. Without this, the rate limiter keys
  // every request to the proxy's IP and all users share one bucket.
  app.set('trust proxy', 1);

  app.use(helmet());

  const corsOrigin = configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    credentials: false,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const swaggerUser = configService.get<string>('SWAGGER_USER');
  const swaggerPassword = configService.get<string>('SWAGGER_PASSWORD');
  if (!swaggerUser || !swaggerPassword) {
    throw new Error(
      'SWAGGER_USER and SWAGGER_PASSWORD environment variables are required to protect the API docs.',
    );
  }
  app.use(
    ['/api/docs', '/api/docs-json'],
    basicAuth({
      challenge: true,
      users: { [swaggerUser]: swaggerPassword },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sprage API')
    .setDescription(
      'Sprage backend: spaced repetition system (SRS) for language learning. ' +
        'Manages decks, cards, languages, reference links and study progress through the SM-2 algorithm.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste the access_token returned at login',
      },
      'JWT-auth',
    )
    .addTag('Decks', "User's card decks")
    .addTag('Cards', 'Study cards')
    .addTag('Progress', 'SM-2 reviews and scheduling')
    .addTag('Languages', 'Languages configured by the user')
    .addTag('Links', 'Reference links by language')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = configService.get<number>('PORT') || 5000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI available at: http://localhost:${port}/api/docs`);
}
bootstrap();
