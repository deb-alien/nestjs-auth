import { Injectable } from '@nestjs/common';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Tokens } from './interfaces';
import { OTPManager } from './providers/otp-manager.service';
import { RefreshTokenProvider } from './providers/refresh-token.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { SignOutProvider } from './providers/sign-out.provider';
import { SignUpProvider } from './providers/sign-up.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly otpManager: OTPManager,
    private readonly signUpProvider: SignUpProvider,
    private readonly signInProvider: SignInProvider,
    private readonly signOutProvider: SignOutProvider,
    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}

  public async signUp(dto: SignUpDto): Promise<void> {
    return await this.signUpProvider.signUp(dto);
  }

  public async signIn(dto: SignInDto): Promise<Tokens> {
    return await this.signInProvider.signIn(dto);
  }

  public async refreshToken(id: string, token: string): Promise<Tokens> {
    return await this.refreshTokenProvider.refreshToken(id, token);
  }

  public async signOut(id: string): Promise<void> {
    return await this.signOutProvider.signOut(id);
  }

  public async verifyEmail(otp: string): Promise<void> {
    return await this.otpManager.verifyEmailOTP(otp);
  }

  public async resendOTP(email: string): Promise<void> {
    return await this.otpManager.resendEmailVerifyOTP(email);
  }

  public async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    return this.otpManager.sendForgotPasswordOTP(dto.email);
  }

  public async resetPassword(dto: ResetPasswordDto): Promise<void> {
    return await this.otpManager.verifyPasswordResetOTP(
      dto.otp,
      dto.newPassword,
    );
  }
}
