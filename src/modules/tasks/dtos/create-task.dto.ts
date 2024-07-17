import { Type } from 'class-transformer';
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

export class StringInRange {
  @IsString()
  @Length(3, 50)
  value: string;
}

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsBoolean()
  @IsOptional()
  isPrivate: boolean;

  @IsEnum(['list', 'text'], {
    message: 'type of the task is required (list, text)',
  })
  type: 'list' | 'text';

  @Type(() => StringInRange)
  @ValidateIf((o) => o.type === 'text')
  body: string;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => StringInRange)
  @ValidateIf((o) => o.type === 'list')
  items: StringInRange[];

  @IsString()
  @Length(24, 24)
  categoryId: string;
}
