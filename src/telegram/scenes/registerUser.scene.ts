import { Context, Wizard, WizardStep } from 'nestjs-telegraf';
import { SCENES } from 'src/common/constants';

import { Markup } from 'telegraf';

import { TelegramUtils } from '../telegram.utils';
import { TelegramService } from '../telegram.service';

import { validateText, validateUserLastName } from '../../common/utils';

import { BOT_MESSAGES } from '../telegram.messages';
import { TELEGRAM_BTN_ACTIONS } from '../../common/constants';

@Wizard(SCENES.REGISTER_USER)
export class RegisterUserScene {
  private readonly telegramUtils: TelegramUtils;

  constructor(private readonly telegramService: TelegramService) {
    this.telegramUtils = new TelegramUtils();
  }

  @WizardStep(1)
  async step1(@Context() ctx) {
    // Get initial data
    const { chatID, telegramNickname } = ctx?.wizard?.state;

    // Add store 'userData' to collect entered user's data
    ctx.wizard.state.userData = {};
    ctx.wizard.state.userData.chatID = chatID;
    ctx.wizard.state.userData.telegramNickname = telegramNickname;

    const keyboard = [
      [
        Markup.button.callback(
          BOT_MESSAGES.BTN_TITLE.OK,
          TELEGRAM_BTN_ACTIONS.OK,
        ),
        Markup.button.callback(
          BOT_MESSAGES.BTN_TITLE.CANCEL,
          TELEGRAM_BTN_ACTIONS.CANCEL,
        ),
      ],
    ];
    await ctx.reply(
      BOT_MESSAGES.DATA_PROCESSING_AGREEMENT,
      Markup.inlineKeyboard(keyboard),
    );

    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(@Context() ctx) {
    // Get action on clicked btn from prev step
    const selectedAction: string = ctx?.update?.callback_query?.data;

    // If user did not click on btn, return it to prev step
    if (!selectedAction) {
      await ctx.reply(BOT_MESSAGES.ERROR.CHECK_BTN);

      return;
    }

    // User clicked on Cancel btn
    if (selectedAction === TELEGRAM_BTN_ACTIONS.CANCEL) {
      await ctx.reply(BOT_MESSAGES.CANCEL_REGISTRATION);

      return ctx.scene.leave();
    }

    // Ask user enter his first name
    await ctx.reply(BOT_MESSAGES.ENTER_FIRST_NAME);

    // Go to next step
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(@Context() ctx) {
    // Get user's entered text
    const firstName: string = ctx?.message?.text;

    // Validate user text (first name), minimum 2 letters
    const isFirstNameValid = validateText(firstName);

    // User name does not valid, return user to prev step
    if (!isFirstNameValid) {
      try {
        await ctx.reply(BOT_MESSAGES.ERROR.FIRST_NAME, { parse_mode: 'html' });
      } catch (error) {
        console.log('sendMessage :::', error.message);
      }

      return;
    }

    const formatedUserFirstName = firstName.trim();
    // Add user's first name to the state
    ctx.wizard.state.userData.firstName = formatedUserFirstName;

    // Ask user enter his last name
    await ctx.reply(BOT_MESSAGES.ENTER_LAST_NAME);

    // Send btn skip enter last name
    try {
      await this.telegramUtils.handleDelayedSendMessage({
        delayValue: 1000,
        ctx,
        action: this.telegramUtils.skipSceneStep,
      });
    } catch (error) {
      console.log('sendMessage :::', error.message);

      return ctx.scene.leave();
    }

    // Go to next step
    ctx.wizard.next();
  }

  @WizardStep(4)
  async step4(@Context() ctx) {
    // Get user's entered text (last name)
    const lastName: string = ctx?.message?.text;

    if (lastName) {
      // Validate user text (last name)
      const isLastNameValid = validateUserLastName(lastName);

      // Return user to prev step
      if (!isLastNameValid) {
        await ctx.reply(BOT_MESSAGES.ERROR.LAST_NAME, {
          parse_mode: 'html',
        });

        return;
      }

      // Add user last name to the state
      const formatedUserLastName = lastName.trim();
      ctx.wizard.state.userData.lastName = formatedUserLastName;
    }

    // Send btn for user share his current phone number
    try {
      await this.telegramUtils.sharePhone(ctx);
    } catch (error) {
      await ctx.reply(BOT_MESSAGES.ERROR.GENERAL, {
        parse_mode: 'html',
      });

      return ctx.scene.leave();
    }

    // Go to next step
    ctx.wizard.next();
  }

  @WizardStep(5)
  async step5(@Context() ctx) {
    // Here must be user's shared phone
    const userPhone: string = ctx?.update?.message?.contact?.phone_number;

    // User did not click on btn share phone
    if (!userPhone) {
      try {
        await ctx.reply(BOT_MESSAGES.ERROR.USER_PHONE, { parse_mode: 'html' });
      } catch (error) {
        console.log('sendMessage :::', error.message);
      }

      return;
    }

    const { userData } = ctx.wizard.state;

    const user = await this.telegramService.createUser(userData);

    if (!user) {
      await ctx.reply(BOT_MESSAGES.ERROR.CREATE_USER, { parse_mode: 'html' });
    }

    ctx.scene.leave();
  }
}
