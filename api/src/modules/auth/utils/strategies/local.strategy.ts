import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import AuthProviders from 'src/shared/enums/auth-providers.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(
      AuthProviders.LOCAL,
      email,
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
