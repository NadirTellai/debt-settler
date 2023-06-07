import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async validateLogin(
    loginDto: AuthEmailLoginDto,
  ): Promise<{ token: string; user: User }> {
    const user = await this.usersService.findOne({
      username: loginDto.username,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            username: 'username not found',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (isValidPassword) {
      const token = await this.jwtService.sign({
        id: user.id,
        username: user.username
      });

      return { token, user: user };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrect password',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async register(dto: AuthRegisterLoginDto): Promise<any> {
    // todo move the validation to DTO
    dto.username = dto.username.toLowerCase().trim()
    if(dto.password.length < 6)
      throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              password: 'Weak password',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
      );
    if(dto.password !== dto.passwordConfirmation)
      throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              passwordConfirmation: 'Password confirmation does not match the password',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
      );
    const user = await this.usersService.create(dto);
    const token = await this.jwtService.sign({
      id: user.id,
      username: user.username
    });

    return { token, user: user };
  }

  async me(user: User): Promise<User> {
    return this.usersService.findOne({
      id: user.id,
    });
  }

}
