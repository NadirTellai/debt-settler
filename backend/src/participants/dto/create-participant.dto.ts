import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    MinLength,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';


export class CreateParticipantDto {
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    name: string;

    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    avatar: string;

    userId: number
}
