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
  ) {}
  googleLogin(req: Request) {
    const user: GoogleUser = req.user as GoogleUser;
    return { message: 'Logado', user };
  }

  async register(
    createCustomerDto: CreateCustomerDto | CreateCustomerPartialDTO,
  ) {
    createCustomerDto.email = this.cryptoService.encrypt(
      createCustomerDto.email,
    );
    createCustomerDto.document = this.cryptoService.encrypt(
      createCustomerDto.document,
    );
    const customerFound = await this.customerService.findByEmailOrDocument(
      createCustomerDto.email,
      createCustomerDto.document,
    );
    if (customerFound) {
      throw new ConflictException(`Document or email already in use`);
    }
    createCustomerDto.password = this.cryptoService.encryptSalt(
      createCustomerDto.password,
    );
    return await this.customerService.create(createCustomerDto);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email?: string, password?: string) {
    const user = await this.customerService.findByEmailOrDocument(
      this.cryptoService.encrypt(email),
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password: userPassword, ...restUser } = user;
    if (password) {
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
}
