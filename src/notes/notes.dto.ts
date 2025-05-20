import { IsDate, IsNotEmpty } from 'class-validator';

export class NotesDto {
  @IsNotEmpty()
  title: string;

  content?: string;

  @IsDate()
  createdAt: Date;

  tags?: string[];
}

/* interface NotesDto {
  title: string;
  content?: string;
  createdAt: Date;
  tags?: string[];
}

export { NotesDto } */
