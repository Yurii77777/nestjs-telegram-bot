// import { Markup } from 'telegraf';

import { TelegramService } from './telegram.service';

import { TelegramUtils } from './telegram.utils';

// import { TELEGRAM_BTN_ACTIONS } from '../common/constants';
// import { BOT_MESSAGES } from './telegram.messages';

export class TelegramActions {
  private readonly telegramUtils: TelegramUtils;

  constructor(private readonly telegramService: TelegramService) {
    this.telegramUtils = new TelegramUtils();
  }

  async handleUserPurchases(params) {
    const {
      userId,
      // ctx
    } = params;

    console.log('userId', userId);
  }
}
