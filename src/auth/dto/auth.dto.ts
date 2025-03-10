import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { passwordPattern } from '../../common/constants';


export class UserSignInDto {
  @IsNotEmpty()
  @IsString()
  identity: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}


export class UserSignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(passwordPattern, {
    message: 'Password is weak!',
  })
  password: string;

  // @IsNotEmpty()
  // @IsEmail()
  // role:string;
}