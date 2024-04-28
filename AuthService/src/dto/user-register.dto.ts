import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { MatchWith } from '../decorators/match-with.decorator';

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
