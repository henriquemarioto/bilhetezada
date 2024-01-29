export class CreateCustomerDto {
  name: string;
  document?: string;
  birth_date?: Date;
  email: string;
  password?: string;
  picture?: string;
}
