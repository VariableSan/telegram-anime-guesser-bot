import { Logger } from '@nestjs/common';
import { Command, Update } from 'nestjs-telegraf';
import { Context } from '../shared/types/context';
import { TelegramBotService } from './telegram-bot.service';

@Update()
export class TelegramBot {
  logger = new Logger('TelegramBotProvider');

  constructor(private telegramBotService: TelegramBotService) {}

  /* ==================== commands START ==================== */
  @Command('randomanime')
  onCommandList(ctx: Context) {
    this.telegramBotService.handleRandomAnime(ctx);
  }
  /* ==================== commands END ==================== */
}
