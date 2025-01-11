import {
  IsString,
  IsNumber,
  Length,
  Min,
  Max,
  IsCreditCard,
} from 'class-validator';

export class CardDto {
  @IsString()
  @Length(3, 4)
  cvc: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  exp_month: number;

  @IsNumber()
  @Min(new Date().getFullYear())
  exp_year: number;

  @IsCreditCard()
  number: string;
}
