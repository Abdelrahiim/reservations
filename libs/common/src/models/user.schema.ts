import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';

@Schema({ timestamps: true, versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop({ type: String })
  name?: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ default: ['guest'] })
  roles?: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
