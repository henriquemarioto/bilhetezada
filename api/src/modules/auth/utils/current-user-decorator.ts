import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Customer } from 'src/database/typeorm/entities/customer.entity';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as Customer;
  },
);
