export class PaymentConfirmedEvent {
  constructor(
    public readonly orderId: string,
    public readonly paymentId: string,
  ) {}
}
