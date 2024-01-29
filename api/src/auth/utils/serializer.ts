/* eslint-disable @typescript-eslint/ban-types */
import { PassportSerializer } from '@nestjs/passport';
import { Customer } from 'src/customer/entities/customer.entity';
import { CustomerService } from 'src/customer/customer.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly customerService: CustomerService) {
    super();
  }

  serializeUser(user: Customer, done: (err, user: Customer) => void) {
    console.log('Serializer', user);
    done(null, user);
  }
  async deserializeUser(user: any, done: (err, user: Customer) => void) {
    console.log('Deserializer', user);
    const userFound = await this.customerService.findById(user['_id']);
    return userFound ? done(null, user) : done(null, null);
  }
}
