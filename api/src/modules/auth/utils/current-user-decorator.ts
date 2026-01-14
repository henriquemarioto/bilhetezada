import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RequestUser } from '@/shared/dtos/request-user.dto';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as RequestUser;
  },
);
