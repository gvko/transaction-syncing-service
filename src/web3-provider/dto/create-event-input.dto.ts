export class CreateEventInput {
  readonly fromAddress: string;
  readonly toAddress: string;
  readonly value: number;
  readonly block: number;
}