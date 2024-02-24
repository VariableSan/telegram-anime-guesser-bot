import { HttpModule } from '@nestjs/axios';
import { HttpService } from '@nestjs/axios/dist/http.service';
import { Module } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common/interfaces/hooks';
import { Logger } from '@nestjs/common/services';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramBot } from './telegram-bot/telegram-bot';
import { TelegramBotService } from './telegram-bot/telegram-bot.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN ?? '',
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, TelegramBot, TelegramBotService],
})
export class AppModule implements OnModuleInit {
  logger = new Logger('AppModule');

  constructor(private httpService: HttpService) {}

  onModuleInit() {
    this.httpService.axiosRef.interceptors.request.use(
      req => req,
      error => {
        if (error.response) {
          if (error.response.status === 401) {
          }
          this.logger.error(error.response);
        }
        throw Error(error);
      },
    );
  }
}
