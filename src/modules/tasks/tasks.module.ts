import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entities/task.entity';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { UtilitiesModule } from '../utilities/utilities.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    forwardRef(() => CategoriesModule),
    UtilitiesModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
