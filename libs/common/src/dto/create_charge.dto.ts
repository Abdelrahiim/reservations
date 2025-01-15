import { Type } from 'class-transformer';
import { CardDto } from './card.dto';
import {
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
  IsNumber,
  Min,
  IsString,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { CreateChargeRequest } from '../types';

export class CreateChargeDto implements Omit<CreateChargeRequest, 'email'> {
  @ValidateIf((o) => !o.token)
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto)
  card?: CardDto;

  @ValidateIf((o) => !o.card)
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNumber()
  @Min(0.5)
  @IsNotEmpty()
  amount: number;
}
