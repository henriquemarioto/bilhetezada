import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { CustomerService } from 'src/customer/customer.service';
import { AuthService } from '../../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('google.clientId', { infer: true }),
      clientSecret: configService.get('google.secret'),
      callbackURL: 'http://localhost:3132/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails, photos } = profile;
    if (!emails) return;
    const userPayload = {
      email: emails[0].value,
      name: displayName,
      picture: photos ? photos[0].value : '',
      accessToken,
    };
    const user = await this.authService.validateUser(userPayload.email);
    if (user) {
      done(null, user);
      return user;
    }
    const newUser = await this.customerService.create(userPayload);
    done(null, newUser);
    return newUser;
  }
}
