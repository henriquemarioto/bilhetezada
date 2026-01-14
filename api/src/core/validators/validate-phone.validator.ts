import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function isValidPhone(phone: string): boolean {
  //Aceept only this format +CCC DDD NNNNNNNNNN
  const regex = /^\+\d{1,3} \d{1,4} \d{4,10}$/;
  return typeof phone === 'string' && regex.test(phone);
}

@ValidatorConstraint({ name: 'isValidPhone', async: false })
export class IsMobilePhoneConstraint implements ValidatorConstraintInterface {
  validate(phone: string, _args: ValidationArguments): boolean {
    return isValidPhone(phone);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} The phone number ${args.value} is not valid!`;
  }
}
