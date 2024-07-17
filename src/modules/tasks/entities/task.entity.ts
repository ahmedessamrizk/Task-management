import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: [true, 'name of the task is required'] })
  name: string;

  @Prop({ default: true })
  isPrivate: boolean;

  @Prop({
    required: [true, 'type of the task is required (list, text)'],
    enum: ['list', 'text'],
  })
  type: 'list' | 'text';

  @Prop({
    minlength: [3, 'body of the item must be greater than 3 characters'],
    maxlength: [50, 'body of the item must be less than 50 characters'],
  })
  body: string;

  @Prop({ type: [String] })
  items: string[];

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true,
  })
  categoryId: mongoose.Schema.Types.ObjectId;

  // Define virtual field for categoryName
  @Prop({ type: String, ref: 'Category', localField: 'categoryId', foreignField: '_id', justOne: true })
  categoryName: string;  // This will hold the populated categoryName
}


export const TaskSchema = SchemaFactory.createForClass(Task);

