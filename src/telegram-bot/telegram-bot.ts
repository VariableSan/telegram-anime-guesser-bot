import { Command, Update } from 'nestjs-telegraf';
import { Context } from '../shared/types/context';
import { TelegramBotService } from './telegram-bot.service';

@Update()
export class TelegramBot {
  constructor(private telegramBotService: TelegramBotService) {}

  @Command('author')
  onAuthorCommand(ctx: Context) {
    this.telegramBotService.sendRandomAuthorList(ctx);
  }

  @Command('shikimori')
  onShikimoriCommand(ctx: Context) {
    this.telegramBotService.sendRandomShikimoriList(ctx);
  }
}
