import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '@app/common';

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
   * IMPORTANT: Current Implementation Issues & Solutions
   *
   * Problem:
   * Direct card processing requires client-side tokenization using Stripe.js or Elements.
   * The current implementation needs a frontend implementation to:
   * 1. Collect card details securely using Stripe Elements
   * 2. Create a payment method token before sending to this service
   *
   * Frontend Implementation Needed:
   * ```javascript
   * // 1. Initialize Stripe.js
   * const stripe = Stripe('your_publishable_key');
   *
   * // 2. Create Elements instance
   * const elements = stripe.elements();
   * const card = elements.create('card');
   * card.mount('#card-element');
   *
   * // 3. Handle form submission
   * const { paymentMethod } = await stripe.createPaymentMethod({
   *   type: 'card',
   *   card: card,
   * });
   *
   * // 4. Send paymentMethod.id to this service
   * ```
   *
   * Test Tokens (for development only):
   * - pm_card_visa: Valid Visa card
   * - pm_card_visa_debit: Visa debit card
   * - pm_card_mastercard: Valid Mastercard
   * - pm_card_declined: Will trigger a decline
   *
   * Example usage with test token:
   * ```typescript
   * await paymentService.createCharge({
   *   token: 'pm_card_visa',
   *   amount: 2000 // $20.00
   * });
   * ```
   */
  public async createCharge({
    token,
    amount,
  }: CreateChargeDto): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      confirm: true,
      payment_method: token,
      payment_method_types: ['card'],
    });

    return paymentIntent;
  }
}
