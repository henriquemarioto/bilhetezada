import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../auth.service';
import { CustomerService } from '@/modules/customer/customer.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);

    if (!canActivate) {
      throw new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization)
      throw new UnauthorizedException('Authorization not granted');

    const [, jwt] = authorization.split('Bearer ');

    const isLoggedOut = await this.authService.hasLogout(jwt);

    if (isLoggedOut) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    const user = await this.customerService.findById(request.user.userId);

    if (!user?.active) {
      throw new UnauthorizedException('Non-active user.');
    }

    return true;
  }
}
