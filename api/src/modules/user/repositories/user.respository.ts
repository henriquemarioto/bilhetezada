import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import AuthProviders from '@/shared/enums/auth-providers.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';
import { WhereCondition } from '@/core/common/base.repository';

@Injectable()
export class UserRepository extends TypeOrmBaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async createUser(
    provider: AuthProviders,
    data: CreateUserDto,
  ): Promise<User> {
    return this.createImplementation({
      ...data,
      auth_provider: provider,
      picture_url: `https://api.dicebear.com/9.x/identicon/svg?seed=${data.name}`,
    });
  }

  async findOneById(userId: string): Promise<User | null> {
    return this.findOneImplementation({
      where: { id: userId },
    });
  }

  async findByEmailOrDocument(
    email: string = '',
    doc: string = '',
  ): Promise<User | null> {
    const [userByEmail, userByDocument] = await Promise.all([
      email
        ? this.findOne({
          where: {
            email: email,
          },
        })
        : null,
        null,
      // doc
      //   ? this.findOne({
      //     where: { document: doc },
      //   })
      //   : null,
    ]);
    return userByEmail || userByDocument;
  }

  async emailExists(email: string): Promise<boolean> {
    return this.existsImplementation({
      email: email,
    });
  }

  async updatePixKey(userId: string, pixKey: string): Promise<void> {
    await this.updateImplementation(userId, {
      pix_key: pixKey,
    });
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const result = await this.updateImplementation(userId, updateUserDto);
    return result.raw;
  }

  async verifyUserEmail(userId: string): Promise<void> {
    await this.updateImplementation(userId, {
      email_verified: true,
    });
  }
}
