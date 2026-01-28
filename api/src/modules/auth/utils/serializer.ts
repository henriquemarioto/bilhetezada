/* eslint-disable @typescript-eslint/ban-types */
import { User } from '@/modules/user/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../../user/services/user.service';
import { Logger } from '@/core/logger/logger.interface';
import { LOGGER } from '@/core/logger/logger.tokens';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  private readonly logger: Logger;

  constructor(
    private readonly userService: UserService,
    @Inject(LOGGER)
    baseLogger: Logger,
  ) {
    super();
    this.logger = baseLogger.withContext(SessionSerializer.name);
  }

  serializeUser(user: User, done: (err, user: User) => void) {
    this.logger.info('Serializer', { user });
    done(null, user);
  }

  async deserializeUser(user: any, done: (err, user: User | null) => void) {
    this.logger.info('Deserializer', { user });
    const userFound = await this.userService.getById(user['_id']);
    return userFound ? done(null, user) : done(null, null);
  }
}
