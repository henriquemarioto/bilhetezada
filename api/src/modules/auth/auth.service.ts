import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Logout } from '../../database/typeorm/entities/logout.entity';
import AuthProviders from '../shared/enums/auth-providers.enum';
import CryptoService from '../shared/services/crypto.service';
import { Repository } from 'typeorm';
import {
  CustomerService,
  CustomerWithoutPassword,
} from '../customer/customer.service';
import {
  CreateCustomerDto,
  CreateCustomerPartialDTO,
} from '../customer/dto/create-customer.dto';

type GoogleUser = {
  email: string;
  firstName: string;
  picture: string;
  accessToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    @InjectRepository(Logout)
    private readonly logoutRepository: Repository<Logout>,
  ) {}
  googleLogin(req: Request) {
    const user: GoogleUser = req.user as GoogleUser;
    return { message: 'Logado', user };
  }

  async signUp(
    provider: AuthProviders,
    createCustomerDto: CreateCustomerDto | CreateCustomerPartialDTO,
  ): Promise<CustomerWithoutPassword> {
    return await this.customerService.create(provider, createCustomerDto);
  }

  async login(user: any) {
    const payload = { username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(
    provider: AuthProviders,
    email: string,
    password?: string,
  ) {
    const user = await this.customerService.findByEmailOrDocument(
      this.cryptoService.encrypt(email),
    );

    if (!user) {
      return null;
    }

    if (!user?.active) {
      throw new UnauthorizedException('Non-active customer.');
    }

    const { password: userPassword, ...restUser } = user;

    if (provider == AuthProviders.LOCAL) {
      const passwordMatch = this.cryptoService.compareHashWithSalt(
        password,
        userPassword,
      );
      if (passwordMatch) {
        return restUser;
      }
      throw new UnauthorizedException();
    }

    return restUser;
  }

  async logout(authorization: string) {
    const [_, jwt] = authorization.split('Bearer ');

    await this.logoutRepository.save({ token: jwt });

    return true;
  }

  async hasLogout(authorization: string) {
    const [_, jwt] = authorization.split('Bearer ');

    if (
      await this.logoutRepository.findOne({
        where: {
          token: jwt,
        },
      })
    ) {
      return true;
    }

    return false;
  }
}
