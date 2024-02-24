import { Markup } from 'telegraf';
import { ButtonActions } from '../types/common';
import { Context } from '../types/context';

export function startupActions(ctx: Context) {
  console.log(ctx.from?.id);

  return Markup.inlineKeyboard(
    [
      Markup.button.callback(
        'Зарегистрировать бизнес 📄',
        ButtonActions.REGISTER_BUSINESS,
      ),
      Markup.button.callback(
        'Активировать бизнес ☑',
        ButtonActions.ACTIVATE_BUSINESS,
      ),
      Markup.button.callback(
        'Деактивировать бизнес ✖',
        ButtonActions.DEACTIVATE_BUSINESS,
      ),
    ],

    {
      columns: 1,
    },
  );
}
