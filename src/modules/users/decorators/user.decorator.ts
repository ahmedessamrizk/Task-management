import { createParamDecorator, ExecutionContext } from "@nestjs/common";

//create custom decorator to extract user from request
export const CurrentUser = createParamDecorator(
    //data is the value passed to the decorator
    //ctx is the wrapper of the incoming request
    (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    },
  );