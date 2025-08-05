import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserService } from '../../user/user.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { OTPManager } from './otp-manager.service';

@Injectable()
export class SignUpProvider {
  constructor(
    private readonly userService: UserService,
    private readonly otpManager: OTPManager,
  ) {}

  public async signUp(dto: SignUpDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) throw new ConflictException('User already exists');

    const passwordHash = await hash(dto.password, 10);
    const user = await this.userService.createUser(dto, passwordHash);

    await this.otpManager.sendEmailVerifyOpt(user.email);
  }
}
