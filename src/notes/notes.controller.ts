import {
  Controller,
  Param,
  Query,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesDto } from './notes.dto';
import { Note } from '../schemas/note.schema';
import { ApiDecorator } from '../common/decorators';

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post('add')
  async createNote(
    @Body() dto: NotesDto,
    @ApiDecorator('x-api-header') accept: boolean,
  ): Promise<Note | HttpException> {
    if (accept) {
      const body =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        'tags' in dto ? { ...dto, tags: this.handleNoteTags(dto?.tags) } : dto;
      return this.notesService.createNote(body);
    }

    return new ForbiddenException('Access denied');
  }

  @Get('all')
  async getAllNotes(
    @ApiDecorator('x-api-header') accept: boolean,
  ): Promise<Note[] | HttpException> {
    if (accept) {
      return this.notesService.getAllNotes();
    }

    return new ForbiddenException('Access denied');
  }

  @Get('one/:id')
  async getNote(
    @Param('id') id: string,
    @ApiDecorator('x-api-header') accept: boolean,
  ): Promise<Note | HttpException> {
    if (accept) {
      return this.notesService.getOneNote(id);
    }

    return new ForbiddenException('Access denied');
  }

  @Patch('update/:id')
  async updateNote(
    @Param('id') id: string,
    @Body() content: NonNullable<any>,
    @ApiDecorator('x-api-header') accept: boolean,
  ): Promise<Note | HttpException> {
    if (accept) {
      const update =
        'tags' in content
          ? { ...content, tags: this.handleNoteTags(content?.tags) }
          : content;

      return this.notesService.updateNoteById(id, update);
    }

    return new ForbiddenException('Access denied');
  }

  @Delete('delete/:id')
  async deleteNote(
    @Param('id') id: string,
    @ApiDecorator('x-api-header') accept: boolean,
  ): Promise<any | HttpException> {
    if (accept) {
      return this.notesService.deleteNote(id);
    }

    return new ForbiddenException('Access denied');
  }

  @Get('filter')
  async getNotes(
    @Query() query: { tag: string | string[] },
    @ApiDecorator('x-api-header') accept: boolean,
  ): Promise<Note[] | HttpException> {
    if (accept) {
      return this.notesService.getNotesByTag(query.tag);
    }

    return new ForbiddenException('Access denied');
  }

  private handleNoteTags(tags: string): string[] {
    if (!tags) {
      return [];
    }

    return tags
      .split(' ')
      .map((tag) => tag.trim())
      .filter((tag) => !!tag);
  }
}
