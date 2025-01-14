import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Messages } from '@app/common';
import { PaymentsCreateChargeDto } from './dto/payment_create_charge.dto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern(Messages.CREATE_CHARGE)
  @UsePipes(new ValidationPipe())
  public async createCharge(
    @Payload() data: PaymentsCreateChargeDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
    return this.paymentService.createCharge(data);
  }
}
