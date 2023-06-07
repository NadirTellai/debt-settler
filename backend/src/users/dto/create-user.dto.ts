import { Transform } from 'class-transformer';
import {
  Equals,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  username: string;

  @MinLength(6)
  password: string;

  @Equals('password', { message: 'Password confirmation must match password' })
  passwordConfirmation: string;

}
