import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  start_time: string;

  @Prop({ required: true })
  end_time: boolean;

  @Prop({ required: true })
  entrance_limit_time: string;

  @Prop({ required: true })
  price: string;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
