import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.session.userId;
  }
}