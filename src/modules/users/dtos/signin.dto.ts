import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @MinLength(3)
  @MaxLength(20)
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}
