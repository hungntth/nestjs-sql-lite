import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: 'auth.USERNAME_NOT_FOUND' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'auth.PASSWORD_NOT_FOUND' })
  password: string;
}
