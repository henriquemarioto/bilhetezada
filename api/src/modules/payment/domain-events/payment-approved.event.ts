export class PaymentApprovedEvent {
  constructor(
    public readonly orderId: string,
    public readonly paymentId: string,
  ) {}
}
