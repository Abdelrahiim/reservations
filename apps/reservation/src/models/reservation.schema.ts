import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class ReservationDocument extends AbstractDocument {
  @Prop({ type: Date, required: true })
  timeStamp: Date;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  placeId: string;

  @Prop({ type: String, required: true })
  invoiceId: string;
}

export const ReservationSchema = SchemaFactory.createForClass(ReservationDocument);

