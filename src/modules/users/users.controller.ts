import { Controller, Get, HttpCode, Post, Session, UseGuards } from '@nestjs/common';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.schema';
import { CurrentUser } from './decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';

// Exclude password from every returned response
@Serialize(UserDto)
@UseGuards(AuthGuard)
@Controller('/users')
export class UsersController {
  @Post('/signout')
  @HttpCode(200)
  signout(@Session() session: any): void {
    session.userId = null;
  }

  @Get('/profile')
  getProfile(@CurrentUser() user: User, @Session() session: any): User {
    return user;
  }
}
