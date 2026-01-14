/* eslint-disable @typescript-eslint/ban-types */
import { User } from '@/modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: (err, user: User) => void) {
    console.log('Serializer', user);
    done(null, user);
  }
  async deserializeUser(user: any, done: (err, user: User | null) => void) {
    console.log('Deserializer', user);
    const userFound = await this.userService.getById(user['_id']);
    return userFound ? done(null, user) : done(null, null);
  }
}
