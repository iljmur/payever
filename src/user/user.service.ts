import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async create(user: User): Promise<any> {
    const existingUser = await this.userModel.findOne({ id: user.id }).exec();
    if (!existingUser) {
      await this.userModel.create(user);
      return 'success';
    } else {
      return 'failed';
    }
  }

  async fetchExternalUserById(id: string): Promise<User> {
    const response = await fetch(`${process.env.REQRES_URI}/api/users/${id}`);

    if (!response.ok) {
      throw new NotFoundException(
        `Failed to fetch user from reqres using id:${id}`,
      );
    }

    const user = await response.json();

    return user.data;
  }
}
