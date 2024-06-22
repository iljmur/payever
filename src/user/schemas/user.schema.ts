import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
