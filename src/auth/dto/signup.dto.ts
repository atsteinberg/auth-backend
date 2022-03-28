import { IsNotEmpty, IsString } from 'class-validator';
import { SigninDto } from './signin.dto';

export class SignupDto extends SigninDto {
  @IsString()
  @IsNotEmpty()
    userName: string;
}
