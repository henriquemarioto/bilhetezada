import { User } from '@/modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface UserWithoutPassword extends Omit<User, 'password'> {}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmailOrDocument(
    email: string = '',
    doc: string = '',
  ): Promise<User | null> {
    const [userByEmail, userByDocument] = await Promise.all([
      email
        ? this.usersRepository.findOne({
            where: {
              email: email,
            },
          })
        : null,
        null
      // doc
      //   ? this.usersRepository.findOne({
      //       where: { document: doc },
      //     })
      //   : null,
    ]);
    return userByEmail || userByDocument;
  }

  async getById(id: string) {
    return await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async disable(id: string): Promise<boolean> {
    await this.usersRepository.update(id, { active: false });
    return true;
  }
}
