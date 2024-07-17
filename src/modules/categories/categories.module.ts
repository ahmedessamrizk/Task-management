import { forwardRef, Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities/category.entity';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    forwardRef(() => TasksModule),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
