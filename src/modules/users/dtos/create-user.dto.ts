import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  name: string;

  @IsEmail()
  @Length(3, 20)
  email: string;

  @IsString()
  @Length(5, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,20}$/, {
    message:
      'Password must be between 5 and 20 characters, contain at least one uppercase letter, one lowercase letter, and one special character @$!%*?&',
  })
  password: string;
}
