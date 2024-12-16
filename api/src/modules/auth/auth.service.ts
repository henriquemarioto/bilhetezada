import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CustomerService } from '../customer/customer.service';
import {
  CreateCustomerDto,
  CreateCustomerPartialDTO,
} from '../customer/dto/create-customer.dto';
import CryptoService from 'src/shared/services/crypto.service';
import { JwtService } from '@nestjs/jwt';
import AuthProviders from 'src/shared/enums/auth-providers.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Logout } from 'src/database/typeorm/entities/logout.entity';
import { Repository } from 'typeorm';

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
    private logoutRepository: Repository<Logout>,
  ) {}
  googleLogin(req: Request) {
    const user: GoogleUser = req.user as GoogleUser;
    return { message: 'Logado', user };
  }

  async register(
    provider: AuthProviders,
    createCustomerDto: CreateCustomerDto | CreateCustomerPartialDTO,
  ) {
    createCustomerDto.email = this.cryptoService.encrypt(
      createCustomerDto.email,
    );
    if (createCustomerDto.document)
      createCustomerDto.document = this.cryptoService.encrypt(
        createCustomerDto.document,
      );
    const customerFound = await this.customerService.findByEmailOrDocument(
      createCustomerDto.email,
      createCustomerDto.document,
    );
    if (customerFound) {
      throw new ConflictException(`Document or email already in use for this.`);
    }
    if (createCustomerDto.password)
      createCustomerDto.password = this.cryptoService.encryptSalt(
        createCustomerDto.password,
      );
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
