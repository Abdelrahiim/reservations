import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Messages } from '@app/common';
import { PaymentsCreateChargeDto } from './dto/payment_create_charge.dto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern(Messages.CREATE_CHARGE)
  @UsePipes(new ValidationPipe())
  public async createCharge(@Payload() data: PaymentsCreateChargeDto) {
    return this.paymentService.createCharge(data);
  }
}
