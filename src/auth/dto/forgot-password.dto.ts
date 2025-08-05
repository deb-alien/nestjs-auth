import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    type: 'string',
    name: 'email',
    description: 'Email Address for sending the reset password OTP',
    maxLength: 96,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
