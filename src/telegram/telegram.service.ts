import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';

import { User } from '../schemas/user.schema';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class TelegramService {
  constructor(private userService: UserService) {}

  async getUser(params): Promise<User> {
    return this.userService.findOne(params);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  async updateUser(params, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(params, updateUserDto);
  }
}
