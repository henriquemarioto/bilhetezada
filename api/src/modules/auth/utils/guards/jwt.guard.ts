import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    const isLoggedOut = await this.authService.hasLogout(authorization);

    if (isLoggedOut) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
