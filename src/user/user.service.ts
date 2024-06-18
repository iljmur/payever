import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>
    ) {}

    async create(user: User): Promise<User> {
        const res = await this.userModel.create(user)
        return res
    }

    async findByReqResId(id: string): Promise<User> {
        const res = await this.userModel.findOne({id}).exec()
        return res
    }

    async updateByReqResId(id: string, user: User): Promise<User> {
        const res = await this.userModel.findOneAndUpdate({ id }, user, { new: true }).exec()   
        return res
    }

    async deleteByReqResId(id: string): Promise<User> {
        return this.userModel.findOneAndDelete({ id }).exec();
    }

    async findExternalUserById(id: string): Promise<User> {
        const response = await fetch(process.env.REQRES_URI + "/api/users/" + id)
        
        if (!response.ok) {
            throw new Error(`Failed to fetch user from reqres using id:${id}, status code: ${response.status}`);
        }
        
        const user = await response.json();
              
        return user.data
    }

    async fetchExternalUserAvatarAsBase64(url: string): Promise<string> {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Failed to fetch image from reqres using url:${url}, status code: ${response.status}`);
          }
      
        const buffer = await response.arrayBuffer();
        const base64String = Buffer.from(buffer).toString('base64');
    
        return base64String;
    }

    isBase64(str: string): boolean {
        // Base64 regular expression pattern
        const base64Regex = /^[A-Za-z0-9+/=]+$/;
      
        // Check if the string matches the pattern
        return base64Regex.test(str) && str.length % 4 === 0 && str.length >= 8;
      }
}
