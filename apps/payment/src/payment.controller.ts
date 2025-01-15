import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentsCreateChargeDto } from './dto/payment_create_charge.dto';
import {
  PaymentServiceController,
  PaymentServiceControllerMethods,
} from '@app/common';

@Controller()
@PaymentServiceControllerMethods()
export class PaymentController implements PaymentServiceController {
  constructor(private readonly paymentService: PaymentService) {}

  @UsePipes(new ValidationPipe())
  public async createCharge(data: PaymentsCreateChargeDto) {
    return this.paymentService.createCharge(data);
  }
}
