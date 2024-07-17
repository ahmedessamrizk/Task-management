import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserDto } from 'src/modules/users/dtos/user.dto';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @Inject(forwardRef(() => TasksService)) private tasksService: TasksService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    user: UserDto,
  ): Promise<Category> {
    const { name } = createCategoryDto;
    const isExist = await this.findByName(name, user._id);
    if (isExist) {
      throw new ConflictException('category already exists');
    }
    return this.categoryModel.create({ name, userId: user._id });
  }

  findAll(userId: UserDto['_id']): Promise<Category[]> {
    return this.categoryModel.find({ userId }, { userId: 0 });
  }

  findById(id: string, userId: UserDto['_id']): Promise<Category> {
    return this.categoryModel.findOne({ _id: id, userId }, { userId: 0 });
  }

  async findByName(
    name: string,
    userId?: UserDto['_id'],
  ): Promise<Category | Category[]> {
    if (!userId) {
      //this case is used in tasks filter by categoryName
      return this.categoryModel.find({ name }, {__v: 0});
    }
    return this.categoryModel.findOne({ name, userId }, { userId: 0, __v: 0 });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    user: UserDto,
  ): Promise<Category> {
    const { name } = updateCategoryDto;

    //check if the category exists
    const isExist = await this.findById(id, user._id);
    if (!isExist) {
      throw new NotFoundException('category not found');
    }

    //check if the new name is already taken by another category
    const isDup = await this.findByName(name, user._id);
    if (isDup) {
      throw new ConflictException('category already exists');
    }

    return this.categoryModel.findByIdAndUpdate(id, { name }, { new: true });
  }

  async remove(id: string, user: UserDto): Promise<null> {
    //check if the category exists
    const isExist = await this.findById(id, user._id);
    if (!isExist) {
      throw new NotFoundException('category not found');
    }

    //remove tasks first.
    await this.tasksService.removeTasksByCategory(id, user);

    //delete the category
    await this.categoryModel.findByIdAndDelete(id);
    return null;
  }
}
