import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOne(params): Promise<User> {
    return this.userModel.findOne(params);
    // .populate({
    //   path: 'purchases',
    //   model: 'Purchase',
    // });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async update(params, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findOneAndUpdate(params, updateUserDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndRemove(id);
  }
}
