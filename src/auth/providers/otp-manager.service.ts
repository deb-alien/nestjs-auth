import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { TooManyRequestsException } from '../../common/exception/too-many-requests.exception';
import { MailService } from '../../mail/mail.service';
import {
  EMAIL_KEY,
  OTP_KEY,
  OTP_LIMIT_KEY,
  RESET_EMAIL_KEY,
  RESET_KEY,
} from '../../redis/constants.redis';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class OTPManager {
  constructor(
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  private makeOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  public async sendEmailVerifyOpt(email: string): Promise<void> {
    const otp = this.makeOTP();

    await Promise.all([
      this.redisService.set(`${EMAIL_KEY}:${otp}`, email, 900),
      this.redisService.set(`${OTP_KEY}:${email}`, otp, 900),
    ]);

    await this.mailService.sendVerificationMail(email, otp);
  }

  public async verifyEmailOTP(otp: string): Promise<void> {
    const email = await this.redisService.get(`${EMAIL_KEY}:${otp}`);
    if (!email) throw new BadRequestException('Invalid or expired OTP');

    const storedOTP = await this.redisService.get(`${OTP_KEY}:${email}`);
    if (storedOTP !== otp) throw new BadRequestException('OTP does not match');

    await this.userService.verifyUserByEmail(email);

    await Promise.all([
      this.redisService.del(`${EMAIL_KEY}:${otp}`),
      this.redisService.del(`${OTP_KEY}:${email}`),
    ]);
  }

  public async resendEmailVerifyOTP(email: string): Promise<void> {
    const limitKey = `${OTP_LIMIT_KEY}:${email}`;
    const currentCount = parseInt(
      (await this.redisService.get(limitKey)) || '0',
    );

    if (currentCount >= 5)
      throw new TooManyRequestsException(
        'Too many OTP requests. Try again later.',
      );

    const otp = this.makeOTP();

    // Store OTP and mapping
    await Promise.all([
      this.redisService.set(`${OTP_KEY}:${email}`, otp, 900),
      this.redisService.set(`${EMAIL_KEY}:${otp}`, email, 900),
      this.redisService.incr(limitKey),
      this.redisService.expire(limitKey, 3600), // 1 hour rate limit window
    ]);

    // Send OTP email
    await this.mailService.sendVerificationMail(email, otp);
  }

  public async sendForgotPasswordOTP(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) return; // silent fail

    const otp = this.makeOTP();

    await Promise.all([
      this.redisService.set(`${RESET_KEY}:${email}`, otp, 60 * 15),
      this.redisService.set(`${RESET_EMAIL_KEY}:${otp}`, email, 60 * 15),
      this.mailService.sendResetPasswordOTP(email, otp),
    ]);
  }

  public async verifyPasswordResetOTP(
    otp: string,
    password: string,
  ): Promise<void> {
    const email = await this.redisService.get(`${RESET_EMAIL_KEY}:${otp}`);
    if (!email) throw new BadRequestException('Invalid or Expired OTP');

    const storedOTP = await this.redisService.get(`${RESET_KEY}:${email}`);
    if (storedOTP !== otp) throw new BadRequestException('OTP does not match');

    await Promise.all([
      this.redisService.del(`${RESET_EMAIL_KEY}:${otp}`),
      this.redisService.del(`${RESET_KEY}:${email}`),
      this.userService.updatePassword(email, password),
      this.mailService.sendPasswordResetSuccessful(email),
    ]);
  }
}
