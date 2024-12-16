import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let checkDigit = (sum * 10) % 11;
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  checkDigit = (sum * 10) % 11;
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;

  return checkDigit === Number(cpf[10]);
}

export function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const calc = (cnpj: string, pos: number): number => {
    let sum = 0;
    let weight = pos - 7;
    for (let i = pos; i >= 1; i--) {
      sum += Number(cnpj[pos - i]) * weight--;
      if (weight < 2) weight = 9;
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digit1 = calc(cnpj, 12);
  const digit2 = calc(cnpj, 13);

  return digit1 === Number(cnpj[12]) && digit2 === Number(cnpj[13]);
}

@ValidatorConstraint({ name: 'isValidDocument', async: false })
export class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments): boolean {
    const cleanedValue = value.replace(/\D/g, '');
    return isValidCPF(cleanedValue) || isValidCNPJ(cleanedValue);
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'The document provided is not valid.';
  }
}
