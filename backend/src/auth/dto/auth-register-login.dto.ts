import { Transform } from 'class-transformer';
import {
  Equals,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class AuthRegisterLoginDto {
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  username: string;

  @MinLength(6)
  password: string;

  passwordConfirmation: string;
}
