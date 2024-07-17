import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsString, Length } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString()
  @Length(3, 20)
  name: string;
}
