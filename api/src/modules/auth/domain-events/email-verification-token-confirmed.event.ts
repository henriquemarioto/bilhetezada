export class EmailVerificationTokenConfirmedEvent {
  constructor(public readonly userId: string) {}
}
