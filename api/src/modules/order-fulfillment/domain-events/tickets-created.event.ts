export class TicketsCreatedEvent {
  constructor(
    public readonly eventId: string,
    public readonly eventName: string,
    public readonly orderId: string,
    public readonly ticketIds: string[],
    public readonly buyerId: string,
    public readonly buyerPhone: string,
  ) {}
}
