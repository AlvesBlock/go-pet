import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3333;

  // ✅ Render/Docker: precisa escutar em 0.0.0.0
  await app.listen(port, '0.0.0.0');

  // ✅ Ajuda no diagnóstico
  const url = await app.getUrl();
  // eslint-disable-next-line no-console
  console.log(`🚀 API online em: ${url}/api`);
}

bootstrap();
