// import { Types } from 'mongoose';

export class CreateUserDto {
  chatID: number;
  telegramNickname: string;
  private firstName?: string;
  private lastName?: string;
  private phone?: string;
}
