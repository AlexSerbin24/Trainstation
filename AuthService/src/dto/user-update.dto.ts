import { IsEmail, IsNotEmpty, Matches, MinLength, IsOptional } from 'class-validator';

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

  @IsNotEmpty({ message: 'Password should not be empty' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*#?&]*/, { message: 'Password too weak' })
  @MinLength(8, { message: 'Password should be at least 8 characters long' })
  password?: string;
}
