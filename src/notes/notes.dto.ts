import { IsNotEmpty } from 'class-validator';

export class NotesDto {
  @IsNotEmpty()
  title: string;

  content?: string;

  tags?: string[];
}
