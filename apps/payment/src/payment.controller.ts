import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from './dto/create_charge.dto';
import { Messages } from '@app/common';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern(Messages.CREATE_CHARGE)
  public async createCharge(@Payload() data: CreateChargeDto) {
    console.log('🚀 ~ PaymentController ~ createCharge ~ data:', data);
    return 'hello world';
  }
}
