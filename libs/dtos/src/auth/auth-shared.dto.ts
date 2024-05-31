import { IsEmail, IsNotEmpty, Matches, MinLength, IsString, IsOptional } from 'class-validator';
import { MatchWith } from '@app/decorators';


export  interface UserTokens {
    id:number,
    email:string,
    accessToken:string,
    refreshToken:string
}

export class UserLoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/, { message: 'Password too weak' })
  @MinLength(8, { message: 'Password should be at least 8 characters long' })
  password: string;
}

export class UserUpdateDataDto {
    @IsOptional()
    @IsNotEmpty({ message: 'Name should not be empty' })
    name?: string;
  
    @IsOptional()
    @IsNotEmpty({ message: 'Last name should not be empty' })
    lastname?: string;
  
    @IsOptional()
    @IsNotEmpty({ message: 'Patronymic should not be empty' })
    patronymic?: string;
  
    @IsOptional()
    @IsEmail({}, { message: 'Invalid email format' })
    email?: string;
  
    @IsOptional()
    @IsNotEmpty({ message: 'Password should not be empty' })
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*#?&]*/, { message: 'Password too weak' })
    @MinLength(8, { message: 'Password should be at least 8 characters long' })
    password?: string;
  }
  


export class UserRegisterDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsNotEmpty({ message: 'Last name should not be empty' })
  lastname: string;

  @IsNotEmpty({ message: 'Patronymic should not be empty' })
  patronymic: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*#?&]*/, { message: 'Password too weak' })
  @MinLength(8, { message: 'Password should be at least 8 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Confirm password should not be empty' })
  @MatchWith('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}



export class TokenVerificationDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
