import { IsString } from 'class-validator';

export class NotifyEmailDto {
  @IsString()
  email: string;
}
