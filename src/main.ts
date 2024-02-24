import { NestFactory } from '@nestjs/core';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { AppModule } from './app.module';

dayjs.locale('ru');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
