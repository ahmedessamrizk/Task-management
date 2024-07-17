import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterTaskDto {
  @IsString()
  @IsOptional()
  categoryName: string;

  @IsEnum(['true', 'false'], {
    message: 'isPrivate must be true or false',
  })
  @IsOptional()
  isPrivate: 'true' | 'false';

  @IsEnum(['isPrivate', 'categoryName'], {
    message: 'sortBy must be isPrivate or categoryName',
  })
  @IsOptional()
  sortBy: string;

  @IsEnum(['asc', 'desc'], {
    message: 'sortOrder must be asc or desc',
  })
  @IsOptional()
  sortOrder: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  size?: string;
}
