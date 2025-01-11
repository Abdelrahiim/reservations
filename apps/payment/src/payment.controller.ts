import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '../../../libs/common/src/dto/create_charge.dto';
import { Messages } from '@app/common';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern(Messages.CREATE_CHARGE)
  @UsePipes(new ValidationPipe())
  public async createCharge(@Payload() data: CreateChargeDto) {
    return this.paymentService.createCharge(data);
  }
}
