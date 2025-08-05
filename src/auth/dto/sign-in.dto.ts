import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class SignInDto {
  @ApiProperty({
    type: 'string',
    name: 'email',
    description: 'email address',
    maxLength: 100,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    name: 'password',
    description: 'password for the user',
    minLength: 8,
    maxLength: 96,
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  password: string;
}
