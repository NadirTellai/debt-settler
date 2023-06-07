import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';

@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(public service: AuthService) {}

  @Post('login')
  public async login(@Body() loginDto: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDto);
  }


  @Post('register')
  async register(@Body() createUserDto: any) {
    return this.service.register(createUserDto);
  }


  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  public async me(@Request() request) {
    return this.service.me(request.user);
  }
}
