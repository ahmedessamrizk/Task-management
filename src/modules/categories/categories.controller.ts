import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/modules/users/decorators/user.decorator';
import { UserDto } from 'src/modules/users/dtos/user.dto';
import { Category } from './entities/category.entity';

@UseGuards(AuthGuard)
@Controller('/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: UserDto,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: UserDto): Promise<Category[]> {
    return this.categoriesService.findAll(user._id);
  }

  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: UserDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto, user);
  }

  @Delete('/:id')
  @HttpCode(204)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
  ): Promise<null> {
    return this.categoriesService.remove(id, user);
  }
}
