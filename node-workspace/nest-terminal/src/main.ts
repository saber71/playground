import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StartupController } from './game/startup.controller';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.get(StartupController).start();
}

bootstrap();
