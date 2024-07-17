import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/entities/user.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({ required: true, minlength: 3, maxlength: 20, unique: false })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
