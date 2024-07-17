import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  _id?: any;

  @IsString()
  @Length(3, 20)
  name: string;
}
