import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    type: 'string',
    name: 'opt',
    description: 'Reset Password OTP Code.',
    maxLength: 6,
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;

  @ApiProperty({
    type: 'string',
    name: 'newPassword',
    description: 'New Password for the user',
    maxLength: 96,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  newPassword: string;
}
