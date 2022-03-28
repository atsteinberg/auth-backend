import { IsEmail, IsString, Length } from 'class-validator';

export class SigninDto {
  @IsEmail()
    email: string;

  @IsString()
  @Length(6, 24)
    password: string;
}
