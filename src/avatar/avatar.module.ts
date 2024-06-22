import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AvatarSchema } from './schemas/avatar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Avatar', schema: AvatarSchema }]),
  ],
  providers: [AvatarService],
  controllers: [AvatarController],
})
export class AvatarModule {}
