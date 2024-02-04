import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  // Types
} from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Number, required: true })
  chatID: number;

  @Prop({ type: String, required: true })
  telegramNickname: string;

  @Prop({
    type: String,
    required: false,
    sparse: true,
    set: (firstName: string) => firstName.toLowerCase(),
  })
  firstName?: string;

  @Prop({
    type: String,
    required: false,
    sparse: true,
    set: (lastName: string) => lastName.toLowerCase(),
  })
  lastName?: string;

  @Prop({
    type: String,
    required: false,
    sparse: true,
  })
  phone?: string;

  // @Prop([{ type: Types.ObjectId, ref: 'Purchase', required: false }])
  // purchases?: Array<Purchase>;
}

export const UserSchema = SchemaFactory.createForClass(User);
