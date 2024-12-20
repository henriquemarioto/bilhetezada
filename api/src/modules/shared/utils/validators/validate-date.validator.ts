import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

function isDateGreaterThanToday(date: string) {
  return new Date(date) > new Date();
}

function isDateLowerThanToday(date: string) {
  return new Date(date) < new Date();
}

@ValidatorConstraint({ name: 'isDateGreaterThanToday', async: false })
export class IsDateGreaterThanTodayConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string, _args: ValidationArguments): boolean {
    return isDateGreaterThanToday(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `The ${args.property} must be greater than today time.`;
  }
}

@ValidatorConstraint({ name: 'isDateLowerThanToday', async: false })
export class IsDateLowerThanTodayConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string, _args: ValidationArguments): boolean {
    return isDateLowerThanToday(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `The ${args.property} must be lower than today time.`;
  }
}

@ValidatorConstraint({ name: 'isEndTimeAfterStartTime', async: false })
export class IsEndTimeAfterStartTimeConstraint
  implements ValidatorConstraintInterface
{
  validate(endTime: any, args: ValidationArguments) {
    const object = args.object as any;
    const startTime = object.start_time;

    if (!endTime || !startTime) {
      return false; // Ambos os campos precisam estar presentes
    }

    return new Date(endTime) > new Date(startTime);
  }

  defaultMessage(args: ValidationArguments) {
    return `The $${args.property} must be later than ${args.object}`;
  }
}

@ValidatorConstraint({ name: 'isDateAfterDate', async: false })
class IsDateAfterDateConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const [relatedFieldName] = args.constraints;
    const relatedFieldValue = object[relatedFieldName];

    if (!value || !relatedFieldValue) {
      return false;
    }

    return new Date(value) > new Date(relatedFieldValue);
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedFieldName] = args.constraints;
    return `The ${args.property} must be later than ${relatedFieldName}`;
  }
}

export function IsDateAfterDate(
  relatedFieldName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [relatedFieldName],
      validator: IsDateAfterDateConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isDateAfterDate', async: false })
class IsDateBetweenDatesConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const [relatedFieldStartName, relatedFieldEndName] = args.constraints;
    const relatedFieldStartValue = object[relatedFieldStartName];
    const relatedFieldEndValue = object[relatedFieldEndName];

    if (!value || !relatedFieldStartValue || !relatedFieldEndValue) {
      return false;
    }

    return (
      new Date(value) > new Date(relatedFieldStartValue) &&
      new Date(value) < new Date(relatedFieldEndValue)
    );
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedFieldStartName, relatedFieldEndName] = args.constraints;
    return `The ${args.property} must be later than ${relatedFieldStartName} and earlier than ${relatedFieldEndName}`;
  }
}

export function IsDateBetweenDates(
  relatedFieldStartName: string,
  relatedFieldEndName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [relatedFieldStartName, relatedFieldEndName],
      validator: IsDateBetweenDatesConstraint,
    });
  };
}
