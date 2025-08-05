import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class OTPDto {
  @ApiProperty({
    type: 'number',
    name: 'opt',
    description: 'Email Verification OTP',
    maxLength: 6,
    minLength: 6,
  })
  @IsString()
  @Length(6, 6)
  otp: string;
}
