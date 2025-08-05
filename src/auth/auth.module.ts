import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './../redis/redis.module';
import { UserModule } from './../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessGuard } from './guard/access.guard';
import { OTPManager } from './providers/otp-manager.service';
import { RefreshTokenProvider } from './providers/refresh-token.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { SignOutProvider } from './providers/sign-out.provider';
import { SignUpProvider } from './providers/sign-up.provider';
import { TokenManager } from './providers/token-manager.service';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [UserModule, JwtModule.register({}), RedisModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    OTPManager,
    SignUpProvider,
    TokenManager,
    SignInProvider,
    SignOutProvider,
    AccessStrategy,
    RefreshStrategy,
    RefreshTokenProvider,
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class AuthModule {}
