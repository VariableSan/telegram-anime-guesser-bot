import { Context as ContextTelegraf } from 'telegraf';
import { Chat } from 'telegraf/typings/core/types/typegram';
import { ContextSession } from './common';

export interface Context extends ContextTelegraf {
  session: ContextSession;
  chat: Chat.PrivateChat;
}
