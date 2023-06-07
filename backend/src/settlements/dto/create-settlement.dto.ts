import {
    IsArray,
    IsInt,
    isNotEmpty,
    IsNotEmpty,
    registerDecorator,
    ValidateNested, ValidationArguments,
    ValidationOptions
} from "class-validator";
import {plainToClass, Transform, Type} from "class-transformer";

class LinkDTO {
    @IsInt()
    source: number;
    @IsInt()
    target: number;
    @IsInt()
    amount: number;
}

export class CreateSettlementDto {
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    title: string;

    @IsArray()
    @IsInt({each: true})
    nodes: number[];

    @IsArray()
    @ValidateNested({each: true})
    @IsNonPrimitiveArray()
    @Type(()=>LinkDTO)
    links: LinkDTO[];

    @ValidateNested()
    @Type(()=>LinkDTO)
    test?: LinkDTO

    // @Isexists
    userId: number
}


export function IsNonPrimitiveArray(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'IsNonPrimitiveArray',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return Array.isArray(value) && value.reduce((a, b) => a && typeof b === 'object' && !Array.isArray(b), true);
                },
            },
        });
    };
}