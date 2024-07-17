import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { CurrentUser } from 'src/modules/users/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FilterTaskDto } from './dtos/filter-task.dto';
import { UserDto } from 'src/modules/users/dtos/user.dto';
import { Task } from './entities/task.entity';

@Controller('/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: UserDto,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  findAll(
    @CurrentUser() user: UserDto,
    @Query() FilterTaskDto: FilterTaskDto,
  ): Promise<Task[]> {
    return this.tasksService.findAll(FilterTaskDto, user);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
  ): Promise<Task> {
    const task = await this.tasksService.findById(id, user._id);
    if (!task) {
      throw new NotFoundException('task not found');
    }
    return task;
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: UserDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @CurrentUser() user: UserDto): Promise<null> {
    return this.tasksService.remove(id, user);
  }
}
