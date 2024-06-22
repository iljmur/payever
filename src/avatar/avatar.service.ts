import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Avatar } from './schemas/avatar.schema';
import * as fs from 'fs';
import { SHA256, enc } from 'crypto-js';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(Avatar.name)
    private avatarModel: Model<Avatar>,
  ) {}

  async getAvatar(id: string): Promise<string> {
    const avatar = await this.avatarModel.findOne({ id }).exec();
    if (avatar) {
      return avatar.base64code;
    }
    const avatarUrl = await this.findExternalUserAvatarUrl(id);
    const avatarImage = await this.fetchImage(avatarUrl);
    const base64code = avatarImage.toString('base64');
    const hash = this.generateHashFromBase64(base64code);
    const imageFileName = this.extractImageFileName(avatarUrl);
    const path = `./avatars/${id}-${hash}-${imageFileName}`;
    fs.writeFileSync(path, avatarImage);
    const newAvatar = new this.avatarModel({ id, hash, path, base64code });
    await newAvatar.save();
    return base64code;
  }

  async deleteAvatar(id: string): Promise<void> {
    const avatar = await this.avatarModel.findOne({ id }).exec();

    if (!avatar) {
      throw new NotFoundException(
        `Unable to delete avatar: avatar with reqres id ${id} not found`,
      );
    }

    fs.unlinkSync(avatar.path);

    await this.avatarModel.deleteOne({ id }).exec();
  }

  async findExternalUserAvatarUrl(id: string): Promise<string> {
    const response = await fetch(`${process.env.REQRES_URI}/api/users/${id}`);
    if (!response.ok) {
      throw new NotFoundException(
        `Failed to fetch user from reqres using id:${id}`,
      );
    }
    const user = await response.json();
    return user.data.avatar;
  }

  async fetchImage(url: string): Promise<Buffer> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new NotFoundException(
        `Failed to fetch image from reqres using url:${url}`,
      );
    }

    const buffer = await response.arrayBuffer();
    const image = Buffer.from(buffer);
    return image;
  }

  extractImageFileName(url: string): string {
    const segments = url.split('/');
    const imageFileName = segments[segments.length - 1];
    return imageFileName;
  }

  generateHashFromBase64(base64code: string): string {
    return SHA256(enc.Base64.parse(base64code)).toString();
  }
}
