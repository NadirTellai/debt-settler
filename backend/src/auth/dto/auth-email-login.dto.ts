import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthEmailLoginDto {
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
