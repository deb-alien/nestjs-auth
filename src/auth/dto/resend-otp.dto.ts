import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOTPDto {
  @ApiProperty({
    type: 'string',
    name: 'email',
    description: 'Email address where OTP will be resent',
    maxLength: 96,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
