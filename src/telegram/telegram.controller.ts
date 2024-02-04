import { Context, Telegraf } from 'telegraf';
import { InjectBot, Start, Update, Command, Action } from 'nestjs-telegraf';

import { User } from 'src/schemas/user.schema';
import { TelegramService } from './telegram.service';

import { TelegramActions } from './telegram.actions';
import { TelegramUtils } from './telegram.utils';

import { COMMANDS } from './telegram.commands';
import { BOT_MESSAGES } from './telegram.messages';
import { SCENES } from '../common/constants';

@Update()
export class TelegramController {
  private readonly telegramActions: TelegramActions;
  private readonly telegramUtils: TelegramUtils;

  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly telegramService: TelegramService,
  ) {
    this.bot.telegram.setMyCommands(COMMANDS);
    this.telegramActions = new TelegramActions(this.telegramService);
    this.telegramUtils = new TelegramUtils();
  }

  @Start()
  async startCommand(ctx): Promise<any> {
    const userTelegramName: string =
      ctx?.update?.message?.from?.first_name ||
      ctx?.update?.message?.from?.username;

    await ctx.reply(`${userTelegramName}${BOT_MESSAGES.NEW_USER_GREETING}`);

    const chatID: number = ctx?.update?.message?.from?.id;

    if (!chatID) {
      await ctx.reply(`${BOT_MESSAGES.ERROR.GENERAL}`);
    }

    const user: null | User = await this.telegramService.getUser({
      chatID,
    });

    // Handlers for new user
    if (!user) {
      await ctx.reply(BOT_MESSAGES.NEW_USER_PERMISSIONS);
    }
    // Handlers for exist user
    else {
      console.log('user', user);
    }
  }

  @Command('my_profile')
  async myProfileCommand(ctx): Promise<any> {
    const chatID: number = ctx?.update?.message?.from?.id;

    if (!chatID) {
      await ctx.reply(`${BOT_MESSAGES.ERROR.GENERAL}`);
    }

    const user: null | User = await this.telegramService.getUser({
      chatID,
    });

    // Message for new user
    if (!user) {
      try {
        await ctx.reply(`${BOT_MESSAGES.NEW_USER_MY_PROFILE}`);
      } catch (error) {
        console.log('sendMessage :::', error.message);
      }
    }
    // Exist user
    else {
      await this.telegramUtils.handleMyProfileCommand({ ctx, user });
    }
  }

  // Handle btns click
  @Action(/^btn_payload_here/g)
  async handler(ctx): Promise<any> {
    try {
      console.log('Yep!', ctx);
    } catch (error) {
      console.log('[error]', error);
    }
  }

  // Enter dialog Scene between buyer and seller
  @Action(/^register_user_btn_payload/g)
  async registerUserScene(ctx): Promise<any> {
    try {
      await ctx.scene.enter(SCENES.REGISTER_USER, {
        // additionalParams
      });
    } catch (error) {
      console.log('ERROR registerUserScene enter :::', error.message);
    }
  }
}
