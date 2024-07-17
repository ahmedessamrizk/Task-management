import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto, StringInRange } from './create-task.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Length(24, 24)
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @Type(() => StringInRange)
  @ValidateIf((o) => o.type === 'text')
  body?: string;

  @IsOptional()
  @IsEnum(['list', 'text'], {
    message: 'type of the task must be [list, text]',
  })
  type?: 'list' | 'text';

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => StringInRange)
  @ValidateIf((o) => o.type === 'list')
  @IsOptional()
  items?: StringInRange[];
}
