import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop([String])
  tags: string[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);
