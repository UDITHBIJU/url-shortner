import {IsAlphanumeric, IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}