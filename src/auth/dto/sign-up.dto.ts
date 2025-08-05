import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
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

  @ApiProperty({
    name: 'firstName',
    type: 'string',
    minLength: 3,
    maxLength: 96,
    description: 'Last name of the user',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(96)
  firstName?: string;

  @ApiProperty({
    name: 'firstName',
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 96,
    description: 'First name of the user',
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}
