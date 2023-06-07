import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    ClassSerializerInterceptor,
    ValidationPipe,
    HttpException,
    HttpStatus,
    ValidationError,
    ValidationPipeOptions, BadRequestException,
} from '@nestjs/common';



const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) =>
      new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: errors.map(error=>getErrors(error)).reduce((acc, curr)=>{
                return {...acc, ...curr}
            }, {}),
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
      ),
};


function getErrors(errors, property = undefined){
    let errorField = property!==undefined ?`${property}.${errors.property}`:errors.property
    let errorsAccumulator = {}
    if(errors.children?.length !== 0)
        errors.children.map(error=>getErrors(error, errorField))
            .forEach(errorObj=>{
                errorsAccumulator = {...errorsAccumulator, ...errorObj}
            })
    if (errors.constraints && Object.values(errors.constraints).length !== 0)
         errorsAccumulator[errorField] = Object.values(errors.constraints).filter(e=>!!e).join(', ')

    return errorsAccumulator
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: {origin: "*"}});
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(5050);
}
bootstrap();
