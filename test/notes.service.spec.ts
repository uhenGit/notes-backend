import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotesService } from '../src/notes/notes.service';
import { Note } from '../src/schemas/note.schema';

// As this is the service only test, modify the common/decorators/api.decorator.ts
// file to return 'true'
describe('NotesService', () => {
  let service: NotesService;

  const mockNote = {
    _id: '65a8f5f9d4c5849a9e8b7a1d',
    title: 'Test Note',
    content: 'Test Content',
    tags: ['test', 'unit'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNoteModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getModelToken(Note.name),
          useValue: mockNoteModel,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const noteDto = {
        title: 'Test Note',
        content: 'Test Content',
        tags: ['test', 'unit'],
      };

      mockNoteModel.create.mockResolvedValue(mockNote);

      const result = await service.createNote(noteDto);

      expect(mockNoteModel.create).toHaveBeenCalledWith(noteDto);
      expect(result).toEqual(mockNote);
    });

    it('should throw InternalServerErrorException when creation fails', async () => {
      const noteDto = {
        title: 'Test Note',
        content: 'Test Content',
        tags: ['test', 'unit'],
      };

      mockNoteModel.create.mockRejectedValue(new Error('Database error'));

      await expect(service.createNote(noteDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getAllNotes', () => {
    it('should return a list of notes', async () => {
      const notes = [mockNote, mockNote];
      mockNoteModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(notes),
      });

      const result = await service.getAllNotes();

      expect(mockNoteModel.find).toHaveBeenCalled();
      expect(result).toEqual(notes);
    });

    it('should throw InternalServerErrorException when fetch fails', async () => {
      mockNoteModel.find.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(service.getAllNotes()).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getOneNote', () => {
    it('should find and return a single note by id', async () => {
      mockNoteModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNote),
      });

      const result = await service.getOneNote('65a8f5f9d4c5849a9e8b7a1d');

      expect(mockNoteModel.findById).toHaveBeenCalledWith(
        '65a8f5f9d4c5849a9e8b7a1d',
      );
      expect(result).toEqual(mockNote);
    });

    it('should throw InternalServerErrorException when fetch fails', async () => {
      mockNoteModel.findById.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(service.getOneNote('invalid-id')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('updateNoteById', () => {
    it('should update a note and return the updated document', async () => {
      const updateContent = { content: 'Updated Content' };
      const updatedNote = { ...mockNote, ...updateContent };

      mockNoteModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedNote),
      });

      const result = await service.updateNoteById(mockNote._id, updateContent);

      expect(mockNoteModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockNote._id },
        updateContent,
      );
      expect(result).toEqual(updatedNote);
    });

    it('should throw InternalServerErrorException when update fails', async () => {
      const updateContent = { content: 'Updated Content' };

      mockNoteModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(
        service.updateNoteById('invalid-id', updateContent),
      ).rejects.toThrow('Database error');
    });
  });

  describe('deleteNote', () => {
    it('should delete a note and return the result', async () => {
      mockNoteModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNote),
      });

      const result = await service.deleteNote(mockNote._id);

      expect(mockNoteModel.findByIdAndDelete).toHaveBeenCalledWith(
        mockNote._id,
      );
      expect(result).toEqual(mockNote);
    });

    it('should throw InternalServerErrorException when deletion fails', async () => {
      mockNoteModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(service.deleteNote('invalid-id')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getNotesByTag', () => {
    it('should return notes matching a single tag', async () => {
      const notes = [mockNote];
      mockNoteModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(notes),
      });

      const result = await service.getNotesByTag('test');

      expect(mockNoteModel.find).toHaveBeenCalledWith({
        tags: { $in: ['test'] },
      });
      expect(result).toEqual(notes);
    });

    it('should return notes matching multiple tags', async () => {
      const notes = [mockNote];
      mockNoteModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(notes),
      });

      const result = await service.getNotesByTag(['test', 'unit']);

      expect(mockNoteModel.find).toHaveBeenCalledWith({
        tags: { $in: ['test', 'unit'] },
      });
      expect(result).toEqual(notes);
    });

    it('should throw InternalServerErrorException when fetch by tag fails', async () => {
      mockNoteModel.find.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(service.getNotesByTag('test')).rejects.toThrow(
        'Database error',
      );
    });
  });
});
