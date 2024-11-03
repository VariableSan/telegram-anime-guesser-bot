import * as dayjs from 'dayjs';
import { startupActions } from '../components/buttons';
import { OrderData } from '../types/common';
import { Context } from '../types/context';

export const defaultDateFormat = 'DD/MM/YYYY';

export function clearLoginData(ctx: Context) {
  ctx.session.login.user = {
    name: '',
    id: '',
    password: '',
  };
  ctx.session.login.type = null;
  ctx.session.login.isUserLoggedIn = false;
}

export function clearLoginStep(ctx: Context) {
  ctx.session.login.step = null;
}

export function clearLoginContext(ctx: Context) {
  clearLoginData(ctx);
  clearLoginStep(ctx);
}

export async function sendDefaultMessage(ctx: Context, message = '') {
  const { user, isUserLoggedIn } = ctx.session.login;
  const botMessage = await ctx.reply(
    `${message + '\n'}Выберите действие ${isUserLoggedIn ? user.name : ''}`,
    startupActions(ctx),
  );
  return botMessage;
}

export function clearCurrentSession(ctx: Context) {
  (ctx.session as any) = {};
}

export function createSessionObject(ctx: Context) {
  ctx.session.login = {
    type: null,
    step: null,
    user: {
      id: '',
      name: '',
      password: '',
    },
    isUserLoggedIn: false,
  };
  ctx.session.order = {
    data: {
      company: {
        id: null,
        name: '',
      },
      date: '',
      food: '',
      photo: '',
    },
    step: null,
  };
  ctx.session.message = {
    id: null,
  };
  ctx.session.menu = {
    data: {
      text: '',
      date: '',
    },
    step: null,
    type: null,
  };
}

export function clearOrderData(ctx: Context) {
  const {
    session: { order },
  } = ctx;
  for (const key in order.data) {
    const orderStepKey = key as keyof OrderData;
    if (orderStepKey === 'company') {
      order.data.company = {
        id: null,
        name: '',
      };
    } else {
      order.data[orderStepKey] = '';
    }
  }
}

export function savePreviousBotMessage(ctx: Context, id?: number) {
  if (id) {
    if (!ctx.session.message) {
      ctx.session.message = {} as any;
      ctx.session.message.id = null;
    }
    ctx.session.message.id = id;
  }
}

export async function deletePreviousBotMessage(ctx: Context) {
  if (ctx.session?.message?.id) {
    try {
      await ctx.deleteMessage(ctx.session.message.id);
    } catch {}
  }
}

export function clearOrderStep(ctx: Context) {
  ctx.session.order.step = null;
}

export function isAdmin(ctx: Context) {
  const adminIds = process.env.ADMIN_IDS?.split(',');
  if (adminIds?.includes(ctx.from?.id.toString() ?? '')) {
    return true;
  }
  return false;
}

export function isModerator(ctx: Context) {
  const moderatorIds = process.env.MODERATOR_IDS?.split(',');
  if (moderatorIds?.includes(ctx.from?.id.toString() ?? '')) {
    return true;
  }
  return false;
}

export function getNextWorkDay(todayDate = new Date()) {
  const date = todayDate;
  const today = dayjs(date).day();

  let daysToAdd = 0;

  if (today === 5) {
    daysToAdd = 3;
  } else {
    daysToAdd = 1;
  }

  const nextWorkDay = dayjs(date).add(daysToAdd, 'day');

  return nextWorkDay;
}

export function getBusinessStatus(status: boolean) {
  return status ? 'активный' : 'не активный';
}

export function clearMenuData(ctx: Context) {
  ctx.session.menu.data = {
    text: '',
    date: '',
  };
  ctx.session.menu.type = null;
}

export function clearMenuStep(ctx: Context) {
  ctx.session.menu.step = null;
}

export function cloneDateAndResetTime(date: Date) {
  const cloneDate = new Date(date.getTime());
  cloneDate.setHours(0, 0, 0, 0);
  return cloneDate;
}

export function getRandomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateUniqueRandomNumbers(
  count: number,
  min: number,
  max: number,
) {
  const result: number[] = [];
  while (result.length < count) {
    const randomNum = getRandomIntFromInterval(min, max);
    if (!result.includes(randomNum)) {
      result.push(randomNum);
    }
  }
  return result;
}

export function replaceNonAlphanumeric(input: string) {
  return input.replace(/[^a-zA-Z0-9\sа-яА-ЯёЁ]/g, '');
}
