import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

	@IsStrongPassword()
  password: string;
}
