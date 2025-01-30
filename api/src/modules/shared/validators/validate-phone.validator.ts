import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidPhone', async: false })
export class IsMobilePhoneConstraint implements ValidatorConstraintInterface {
  validate(phone: string, _args: ValidationArguments): boolean {
    // Aceita apenas no seguinte formato: +55 16912345678
    const regex = /^\+(\d{1,3})\s?(\d{2})\s?\d{9}$/;
    return typeof phone === 'string' && regex.test(phone);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} O número de telefone celular ($value) não é válido!`;
  }
}
