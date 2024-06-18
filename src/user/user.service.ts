import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private bookModel: mongoose.Model<User>
    ) {}

    async findAll(): Promise<User[]> {
        const users = await this.bookModel.find()
        return users
    }
}
