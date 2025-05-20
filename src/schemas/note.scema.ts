import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
// @todo define NoteDocument
export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop([String])
  tags: string[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);
