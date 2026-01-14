import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import AuthProviders from '@/shared/enums/auth-providers.enum';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('google.clientId', { infer: true }),
      clientSecret: configService.get('google.secret'),
      callbackURL: 'http://localhost:3132/login/google/callback',
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
      picture_url: photos ? photos[0].value : '',
    };
    const user = await this.authService.validateUser(
      AuthProviders.GOOGLE,
      userPayload.email,
    );
    if (user) {
      done(null, user);
      return user;
    }
    const newUser = await this.authService.signUp(
      AuthProviders.GOOGLE,
      userPayload,
    );
    done(null, newUser);
    return newUser;
  }
}
