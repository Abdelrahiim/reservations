import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from './dto/create_charge.dto';

@Injectable()
export class PaymentService {
  private readonly stripe = new Stripe(
    this.configService.get<string>('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-12-18.acacia',
    },
  );

  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates a charge using the provided card details and amount.
   * @param {Stripe.PaymentMethodCreateParams.Card} card - The card details for the payment method.
   * @param {number} amount - The amount to be charged in USD.
   * @returns {Promise<Stripe.PaymentIntent>} - The created payment intent.
   */
  public async createCharege({
    card,
    amount,
  }: CreateChargeDto): Promise<Stripe.PaymentIntent> {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card,
    });
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      currency: 'usd',
      confirmation_method: 'manual',
      payment_method_types: ['card'],
    });
    return paymentIntent;
  }
}
