import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Avatar extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  base64code: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
