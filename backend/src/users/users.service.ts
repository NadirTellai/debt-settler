import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const usernameExists = await this.usersRepository.exist({
      where: {username: createUserDto.username}
    })
    if(usernameExists)
      throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              username: 'username exists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
      );
    return this.usersRepository.save(
      this.usersRepository.create(createUserDto),
    );
  }

  findOne(fields) {
    return this.usersRepository.findOne({
      where: fields,
    });
  }

}
