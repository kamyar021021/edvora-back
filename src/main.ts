import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3001;
  const frontendUrl = config.get<string>('FRONTEND_URL');

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://192.168.1.222:3000',
      frontendUrl,
    ].filter(Boolean),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port, "0.0.0.0");
  console.log(`🚀 Server running on http://localhost:${port}/api`);
}
bootstrap();
