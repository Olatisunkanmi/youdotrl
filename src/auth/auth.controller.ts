import { Body, Controller, Post } from '@nestjs/common';
import  AuthService  from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseMetadata } from '../common/decorators/response.decorator';
import { UserSignInDto, UserSignUpDto} from './dto/auth.dto';
import { Public } from '../common/decorators/auth.public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Create an account
   */
  @Public()
  @Post('signup')
  async signUp(@Body() authCredentials: UserSignUpDto) {
    return this.authService.signUp(authCredentials);
  }

  /**
   * Log in account
   */
  @Public()
  @ApiResponseMetadata({
    statusCode: 200,
  })
  @Post('login')
  signIn(@Body() signInDto: UserSignInDto) {
    return this.authService.signIn(signInDto);
  }
}
