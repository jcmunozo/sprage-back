import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOrigin = configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sprage API')
    .setDescription(
      'Backend de Sprage: sistema de repetición espaciada (SRS) para aprendizaje de idiomas. ' +
        'Gestión de mazos, tarjetas, idiomas, enlaces de referencia y progreso de estudio mediante el algoritmo SM-2.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Introduce el access_token devuelto por /auth/login',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Registro e inicio de sesión')
    .addTag('Decks', 'Mazos de tarjetas del usuario')
    .addTag('Cards', 'Tarjetas de estudio')
    .addTag('Progress', 'Revisiones y planificación SM-2')
    .addTag('Languages', 'Idiomas configurados por el usuario')
    .addTag('Links', 'Enlaces de referencia por idioma')
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
