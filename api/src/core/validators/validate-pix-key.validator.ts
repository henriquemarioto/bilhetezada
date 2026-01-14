import {
  isEmail,
  isUUID,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IsDocumentConstraint } from './validate-document.validator';
import { IsMobilePhoneConstraint } from './validate-phone.validator';

export function isValidPixKey(pixKey: string): boolean {
  const validationArray = [
    new IsMobilePhoneConstraint().validate(pixKey, {} as ValidationArguments),
    new IsDocumentConstraint().validate(pixKey, {} as ValidationArguments),
    isEmail(pixKey),
    isUUID(pixKey),
  ];

  return validationArray.some((isValid) => isValid);
}

@ValidatorConstraint({ name: 'isValidPixKey', async: false })
export class IsPixKeyConstraint implements ValidatorConstraintInterface {
  validate(pixKey: string, _args: ValidationArguments): boolean {
    return isValidPixKey(pixKey);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} The pix key ${args.value} is not valid!`;
  }
}
