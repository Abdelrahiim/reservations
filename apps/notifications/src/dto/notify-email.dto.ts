import { IsString } from 'class-validator';

export class NotifyEmailDto {
  @IsString()
  email: string;

  @IsString()
  text: string;
}
