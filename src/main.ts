import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONT_END_URL ?? 'http://localhost:5173',
    credentials: true,
  });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Plataforma de Eventos e Ingressos - API')
    .setDescription(
      'API para gerenciamento de eventos, emissão de ingressos com QR Code e portaria',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'json',
        name: 'JWT',
        description: 'Insira o token JWT retornado no login',
        in: 'header',
      },
      'JWT-Auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);

  logger.log(`🚀 API rodando em: http://localhost:${process.env.PORT ?? 3000}`);
  logger.log(
    `📚 Swagger Docs disponível em: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}
bootstrap();
