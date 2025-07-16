import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'isHttpUrl', async: false })
export class IsHttpUrlConstraint implements ValidatorConstraintInterface {
  validate(url: string): boolean {
    try {
      return /^https?:\/\//.test(url) && !!new URL(url);
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return 'URL must start with http:// or https:// and be a valid URL';
  }
}

export function IsHttpUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isHttpUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsHttpUrlConstraint,
    });
  };
}
