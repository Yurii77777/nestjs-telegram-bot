import { Markup } from 'telegraf';

import { ISendMessageOptions } from '../interfaces/sendMessageOptions';

import { BOT_MESSAGES } from './telegram.messages';
import { TELEGRAM_BTN_ACTIONS } from '../common/constants';

export class TelegramUtils {
  async createDelayedSendMessage(timerValue: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, timerValue));
  }

  async handleDelayedSendMessage(options: ISendMessageOptions): Promise<any> {
    const { delayValue, ctx, message, action } = options;

    await this.createDelayedSendMessage(delayValue);

    if (message) {
      await ctx.reply(message);
    } else {
      await action(ctx);
    }
  }

  async skipSceneStep(ctx) {
    const keyboard = [
      [
        Markup.button.callback(
          BOT_MESSAGES.BTN_TITLE.SKIP,
          TELEGRAM_BTN_ACTIONS.SKIP_STEP,
        ),
      ],
    ];
    ctx.reply(
      `${BOT_MESSAGES.SKIP_SCENE_STEP_PARAGRAPH}`,
      Markup.inlineKeyboard(keyboard),
    );
  }

  async sharePhone(ctx: any) {
    const keyboard = [
      [
        {
          text: BOT_MESSAGES.BTN_TITLE.SHARE_PHONE_NUMBER,
          request_contact: true,
        },
      ],
    ];

    try {
      await ctx.reply(BOT_MESSAGES.SHARE_PHONE_PARAGRAPH, {
        reply_markup: { keyboard },
      });
    } catch (error) {
      console.log('sendMessage :::', error.message);
    }

    try {
      await ctx.reply(BOT_MESSAGES.SHARE_PHONE_PARAGRAPH_2, {
        parse_mode: 'html',
      });
    } catch (error) {
      console.log('sendMessage :::', error.message);
    }
  }

  parseQueryParamsFromString(queryString: string): {
    [key: string]: string | number;
  } {
    // eslint-disable-next-line prefer-const
    let result = {};

    if (!queryString) {
      return result;
    }

    const startQueryString: number = queryString.indexOf('?') + 1;
    const endQueryString: number = queryString.length;
    const formattedString: string = queryString.substring(
      startQueryString,
      endQueryString,
    );
    const pairs: Array<string> | [] = formattedString.split('&');

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');

      result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }

    return result;
  }

  async handleUserDocument(ctx: any): Promise<null | string> {
    // Get user donwloaded file
    let result: null | string = null;
    const userFiles = ctx?.update?.message?.photo;
    const isUserFiles = userFiles && !!userFiles.length;

    if (!isUserFiles) {
      return result;
    }

    // Get last uploaded user's file id
    const { file_id } = userFiles[userFiles.length - 1];
    result = file_id;

    return result;
  }

  async handleMyProfileCommand(params: { ctx; user }) {
    const {
      // ctx,
      user,
    } = params;
    const { _id: userId } = user;

    console.log('userId', userId);
  }
}
