import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './entities/task.entity';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/modules/categories/categories.service';
import { FilterTaskDto } from './dtos/filter-task.dto';
import { UserDto } from 'src/modules/users/dtos/user.dto';
import { UtilitiesService } from '../utilities/utilities.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
    private utilitiesService: UtilitiesService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: UserDto): Promise<Task> {
    //inputs ==> name, userId, categoryId, isPrivate, type:[list, text], body: optional, items: optional
    //check if category exists for this user
    const catExists = await this.categoriesService.findById(
      createTaskDto.categoryId,
      user._id,
    );
    if (!catExists) {
      throw new NotFoundException('category does not exist');
    }

    createTaskDto.type === 'list'
      ? delete createTaskDto.body
      : delete createTaskDto.items;

    //add the user id & category id to the createTaskDto
    const newTask = {
      ...createTaskDto,
      userId: user._id,
    };

    //create a new task
    return this.taskModel.create(newTask);
  }

  async findAll(filterTaskDto: FilterTaskDto, user?: UserDto): Promise<Task[]> {
    let { categoryName, isPrivate, sortBy, sortOrder, page, size } =
      filterTaskDto;

    //filter
    //apply tasks privacy logic on filter object at intial stage.
    const filter: any = this.handleTaskPrivacy(isPrivate, user);
    if (filter.length === 0) return [];

    //check if category exists.
    if (categoryName) {
      const categories = await this.categoriesService.findByName(categoryName);
      if (!categories) {
        return [];
      }
      filter.categoryId = { $in: categories };
    }

    //sort
    const sort: any = {};

    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    //pagination
    const { limit, skip } = this.utilitiesService.paginate(+page, +size);
    
    const tasks = await this.taskModel
      .find(filter)
      .sort({ ...sort, _id: 1 })
      .populate([
        {
          path: 'categoryId',
          select: 'name',
        },
        {
          path: 'userId',
          select: 'name email',
        },
      ])
      .skip(skip)
      .limit(limit)
      .exec();

    // Sort by categoryName if specified, this sort is done after paginate not before it.
    if (sortBy === 'categoryName') {
      (sortOrder as any) = sortOrder === 'asc' ? 1 : -1;
      tasks.sort((a, b) => {
        const nameA = a.categoryId['name'].toUpperCase(); // Convert to uppercase for case-insensitive comparison
        const nameB = b.categoryId['name'].toUpperCase();

        if (nameA < nameB) return -1 * +sortOrder; // Multiply by sortOrder to reverse order for descending
        if (nameA > nameB) return 1 * +sortOrder;
      });
    }

    return tasks;
  }

  handleTaskPrivacy(isPrivate: string, user?: UserDto) {
    const filter: any = {};
    if (isPrivate) {
      // if viewer tries to view private tasks, return empty array.
      if (isPrivate === 'true' && !user?._id) {
        return [];
      }
      // if user is logged in and want to view private tasks, then view his only private ones.
      if (user?._id && isPrivate === 'true') {
        filter.userId = user._id;
      }
      filter.isPrivate = isPrivate;
    } else {
      // if used doesn't apply filter on tasks' privacy, return public tasks + his own private tasks
      if (user?._id) {
        filter.$or = [
          { isPrivate: 'false' },
          { isPrivate: 'true', userId: user._id },
        ];
      } else {
        // if user is not logged in, return only public tasks
        filter.isPrivate = 'false';
      }
    }
    return filter;
  }

  findById(id: string, userId: any): Promise<Task> {
    return this.taskModel.findOne({ _id: id, userId });
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: UserDto,
  ): Promise<Task> {
    //update task: name, body, items, isPrivate

    //check if the task exists
    const isExist = await this.findById(id, user._id);
    if (!isExist) {
      throw new NotFoundException('task not found');
    }

    if (updateTaskDto.categoryId) {
      //check if the updated category is exist and belongs to the user
      const catExists = await this.categoriesService.findById(
        updateTaskDto.categoryId,
        user._id,
      );
      if (!catExists) {
        throw new NotFoundException('category not found');
      }
    }

    //update the task
    return await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
      new: true,
    });
  }

  async remove(id: string, user: UserDto): Promise<null> {
    //check if the task exists
    const isExist = await this.taskModel.findById(id, user._id);
    if (!isExist) {
      throw new NotFoundException('task not found');
    }

    //delete the task
    await this.taskModel.findByIdAndDelete(id);
    return null;
  }

  async removeTasksByCategory(categoryId: string, user: UserDto): Promise<any> {
    //delete the tasks
    return this.taskModel.deleteMany({ categoryId, userId: user._id });
  }
}
