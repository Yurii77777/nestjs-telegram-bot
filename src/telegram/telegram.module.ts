import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';
import { session } from 'telegraf';

import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { UserModule } from '../user/user.module';

import { RegisterUserScene } from './scenes/registerUser.scene';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TelegrafModule.forRoot({
      middlewares: [session()],
      token: process.env.TELEGRAM_BOT_TOKEN,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [TelegramService, TelegramController, RegisterUserScene],
})
export class TelegramModule {}
