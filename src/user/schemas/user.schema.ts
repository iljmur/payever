import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,

})

export class User {
    @Prop()
    email: string;

    @Prop()
    first_name: string;

    @Prop()
    last_name: string;

    @Prop()
    avatar: string;
}


export const UserSchema = SchemaFactory.createForClass(User)