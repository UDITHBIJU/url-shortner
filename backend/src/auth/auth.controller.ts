import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './guards/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
//post signup


@Post('signup')
async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
@Post('login')
async login(@Body() loginDto: LoginDto) {
  console.log('Login attempt with:', loginDto);
    return this.authService.login(loginDto);
  }
  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }
  @Delete('delete')
  async deleteUser(@Body('userId') userId: string) {
    return this.authService.deleteUser(userId);
  }
  @Get('me')
  async getMe(@User('userId') userId: string) {
    return this.authService.getMe(userId);
  }
}
