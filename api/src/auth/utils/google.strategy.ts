import { AuthService } from './../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
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
    const userPayload = {
      email: emails[0].value,
      name: displayName,
      picture: photos[0].value,
      accessToken,
    };
    const user = await this.authService.validateUser(userPayload.email);
    if (user) {
      done(null, user);
      return;
    }
    const newUser = await this.customerService.create(userPayload);
    done(null, newUser);
  }
}
