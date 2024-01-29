import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  document: string;

  @Prop()
  birth_date: Date;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  password: string;

  @Prop()
  picture: string;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
