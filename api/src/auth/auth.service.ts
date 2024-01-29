import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CustomerService } from 'src/customer/customer.service';
import * as bcrypt from 'bcrypt';
import { CreateCustomerValidatorDto } from 'src/customer/dto/create-customer-validator.dto';

type GoogleUser = {
  email: string;
  firstName: string;
  picture: string;
  accessToken: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly customerService: CustomerService) {}
  googleLogin(req: Request) {
    const user: GoogleUser = req.user as GoogleUser;
    return { message: 'Logado', user };
  }

  async register(createCustomerDto: CreateCustomerValidatorDto) {
    const customersFound = await this.customerService.findByEmailOrDocument(
      createCustomerDto.email,
      createCustomerDto.document,
    );
    if (customersFound) {
      throw new ConflictException(`Document or email already in use`);
    }
    createCustomerDto.password = bcrypt.hashSync(
      createCustomerDto.password,
      10,
    );
    return this.customerService.create(createCustomerDto);
  }

  async validateUser(email?: string, password?: string) {
    const user = await this.customerService.findByEmailOrDocument(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (password) {
      const passwordMatch = await this.passwordMatch(password, user.password);
      if (passwordMatch) {
        const { ...result } = user.toObject();
        return result;
      }
      throw new UnauthorizedException();
    }
    return user;
  }

  async passwordMatch(password: string, encryptPassword: string) {
    return await bcrypt.compare(password, encryptPassword);
  }
}
