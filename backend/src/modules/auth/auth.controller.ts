import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiResponse } from 'src/shared/providers/api-response/api-response';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const user = await this.authService.signIn(signInDto.phone);
    if (user) {
      return ApiResponse.buildApiResponse(
        user,
        200,
        'User logged in successfully',
      );
    } else {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(@Body() signInDto: SignUpDto) {
    const token = await this.authService.signUp(signInDto.phone);
    if (token) {
      return ApiResponse.buildApiResponse(
        token,
        200,
        'User registered successfully',
      );
    } else {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('admin-login')
  async adminLogin(@Body() signInDto: SignInDto) {
    const token = await this.authService.adminLogin(signInDto);
    if (token) {
      return ApiResponse.buildApiResponse(
        token,
        200,
        'User logged in successfully',
      );
    } else {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
  }
}
