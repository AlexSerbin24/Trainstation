import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/, { message: 'Password too weak' })
  @MinLength(8, { message: 'Password should be at least 8 characters long' })
  password: string;
}
