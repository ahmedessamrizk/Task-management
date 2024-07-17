import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor {
  constructor(private readonly usersService: UsersService) {}

  async intercept(context, handler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;
    const user = this.usersService.findOneById(userId);
    request.user = user;
    return handler.handle();
  }
}
