import { Body, Controller, HttpCode, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { User } from 'src/modules/users/entities/user.schema';
import { SigninDto } from 'src/modules/users/dtos/signin.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from 'src/modules/users/dtos/user.dto';

@Serialize(UserDto)
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signup(createUserDto);
  }

  @Post('/signin')
  @HttpCode(200)
  async signin(
    @Body() siginDto: SigninDto,
    @Session() session: any,
  ): Promise<UserDto> {
    const user = await this.authService.signin(siginDto);
    session.userId = user._id;
    return user;
  }
}
