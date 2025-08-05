import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GetUseID } from './decorators/get-current-user-id.decorator';
import { GetUser } from './decorators/get-current-user.decorator';
import { Public } from './decorators/public.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { OTPDto } from './dto/otp.dto';
import { ResendOTPDto } from './dto/resend-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshGuard } from './guard/refresh.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'OTP sent to email' })
  @ApiBody({ type: SignUpDto })
  public async signUp(@Body() dto: SignUpDto) {
    await this.authService.signUp(dto);
    return {
      message: '6 digit OTP has been sent to your email address',
    };
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiBody({ type: SignInDto })
  public async signIn(@Body() dto: SignInDto) {
    return await this.authService.signIn(dto);
  }

  @Public()
  @Get('refresh')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Token refreshed' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer refresh_token',
    required: true,
  })
  public async refreshToken(
    @GetUseID() id: string,
    @GetUser('refresh_token') token: string,
  ) {
    return await this.authService.refreshToken(id, token);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sign out successful' })
  @ApiBearerAuth()
  public async signOut(@GetUseID() id: string) {
    await this.authService.signOut(id);
    return { message: 'SignOut Successful.' };
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user email via OTP' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified successfully',
  })
  @ApiBody({ type: OTPDto })
  public async verifyEmail(@Body() dto: OTPDto) {
    await this.authService.verifyEmail(dto.otp);
    return { message: 'Email is Verified' };
  }

  @Public()
  @Patch('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend OTP to user email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP resent successfully',
  })
  @ApiBody({ type: ResendOTPDto })
  public async resendOTP(@Body() dto: ResendOTPDto) {
    await this.authService.resendOTP(dto.email);
    return { message: 'OTP resend successfully' };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send password reset OTP to email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reset OTP sent if email exists',
  })
  @ApiBody({ type: ForgotPasswordDto })
  public async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto);
    return {
      message: `If this '${dto.email}' email exists we will send a Password Reset OTP`,
    };
  }

  @Public()
  @Patch('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successful',
  })
  @ApiBody({ type: ResetPasswordDto })
  public async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return { message: 'Password Reset Successful' };
  }
}
