import { Model } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotesDto } from './notes.dto';
import { Note } from '../schemas/note.schema';

@Injectable({})
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async createNote(dto: NotesDto): Promise<Note> {
    try {
      return this.noteModel.create(dto);
    } catch (err) {
      throw new InternalServerErrorException(`Create error: ${err.message}`);
    }
  }

  async getAllNotes(): Promise<Note[]> {
    try {
      return this.noteModel.find().exec();
    } catch (err) {
      throw new InternalServerErrorException(`Get all error: ${err.message}`);
    }
  }

  async getOneNote(noteId: string): Promise<Note> {
    try {
      return this.noteModel.findById(noteId).exec();
    } catch (err) {
      throw new InternalServerErrorException(`Get one error: ${err.message}`);
    }
  }

  async updateNoteById(
    noteId: string,
    content: NonNullable<unknown>,
  ): Promise<Note> {
    const filter = { _id: noteId };
    try {
      return this.noteModel.findOneAndUpdate(filter, content).exec();
    } catch (err) {
      throw new InternalServerErrorException(`Update error: ${err.message}`);
    }
  }

  async deleteNote(noteId: string): Promise<any> {
    try {
      return this.noteModel.findByIdAndDelete(noteId).exec();
    } catch (err) {
      throw new InternalServerErrorException(`Delete error: ${err.message}`);
    }
  }

  async getNotesByTag(tag: string | string[]): Promise<Note[]> {
    const searchTag = typeof tag === 'string' ? [tag] : tag;
    try {
      return this.noteModel
        .find({
          tags: { $in: searchTag },
        })
        .exec();
    } catch (err) {
      throw new InternalServerErrorException(
        `Get by tag error: ${err.message}`,
      );
    }
  }
}
