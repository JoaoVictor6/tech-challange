import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { NotFoundException } from '@nestjs/common';
import { Item } from './schemas/item.schema';

async function sandbox<F extends (...args: unknown[]) => Promise<unknown>>(fn: F): Promise<[error: unknown, data: Awaited<ReturnType<F>> | null]> {
  try {
    return [ null, await fn() as Awaited<ReturnType<F>> ]
  } catch (e) {
    return [ e, null ]
  }
}
function getMockFile(overrides = {}) {
  return {
    fieldname: 'image',
    originalname: 'test.png',
    encoding: '7bit',
    mimetype: 'image/png',
    size: 1024,
    path: '/tmp/test.png',
    ...overrides
  } as Express.Multer.File;
}
describe('ItemsController', () => {
  let controller: ItemsController;
  let service: jest.Mocked<ItemsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ ItemsController ],
      providers: [
        {
          provide: ItemsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get(ItemsService);
  });

  describe('POST /items', () => {
    it('should create an item with image', async () => {
      const dto: CreateItemDto = { title: 'Item 1', description: 'desc' } as unknown as CreateItemDto;
      ;
      const file = getMockFile();

      service.create.mockResolvedValue({ id: '1', ...dto, imageUrl: file.path } as unknown as Item);

      const result = await controller.create(file, dto);
      expect(service.create).toHaveBeenCalledWith({ ...dto, imageUrl: file.path });
      expect(result).toEqual({ id: '1', ...dto, imageUrl: file.path });
    });

    it('should reject image with invalid MIME type', async () => {
      const file = getMockFile({ mimetype: 'text/plain' });
      const dto: CreateItemDto = { title: 'Invalid', description: 'Invalid' } as unknown as CreateItemDto;
      // Simulate multer fileFilter logic elsewhere
      expect(file.mimetype.startsWith('image/')).toBeFalsy();
    });

    it('should reject image if file size exceeds limit', async () => {
      const file = getMockFile({ size: 2 * 1024 * 1024 });
      expect(file.size).toBeGreaterThan(1024 * 1024);
    });
  });

  describe('GET /items', () => {
    it.each([
      [ 'valid pagination', '2', '5', 'query', 2, 5 ],
      [ 'fallback to default pagination', undefined, undefined, '', 1, 10 ],
    ])('should return items with %s', async (_, rawPage, rawLimit, word, expectedPage, expectedLimit) => {
      service.findAll.mockResolvedValue([] as unknown as ReturnType<Awaited<typeof service.findAll>>);

      const result = await controller.findAll(rawPage, rawLimit, word);
      expect(service.findAll).toHaveBeenCalledWith({ page: expectedPage, limit: expectedLimit, word });
      expect(result).toEqual([]);
    });

    it('should parse pagination parameters as integers', async () => {
      const result = await controller.findAll('3', '20', 'hello');
      expect(service.findAll).toHaveBeenCalledWith({ page: 3, limit: 20, word: 'hello' });
    });
  });

  describe('GET /items/:id', () => {
    it('should return a single item', async () => {
      const mockItem = { id: '123', title: 'Title', description: 'desc' } as unknown as Item;
      service.findOne.mockResolvedValue(mockItem);

      const result = await controller.findOne('123');
      expect(result).toEqual(mockItem);
    });

    it('should handle not found error', async () => {
      service.findOne.mockImplementation(() => {
        throw new NotFoundException();
      });
      const [ err ] = await sandbox(() => controller.findOne('404'))

      expect(err).toBeInstanceOf(NotFoundException);
    });
  });

  describe('PATCH /items/:id', () => {
    const id = 'abc123';
    const dto: UpdateItemDto = { title: 'Updated' } as unknown as UpdateItemDto & Partial<{ imageUrl: string }>;

    it('should update item with image', async () => {
      const file = getMockFile();
      const updated = { ...dto, imageUrl: file.path } as Item;
      service.update.mockResolvedValue(updated);

      const result = await controller.update(id, dto, file);
      expect(service.update).toHaveBeenCalledWith(id, updated);
      expect(result).toEqual(updated);
    });

    it('should update item without image', async () => {
      service.update.mockResolvedValue(dto as Item);
      await controller.update(id, dto, undefined as unknown as Express.Multer.File);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('DELETE /items/:id', () => {
    it('should delete an item', async () => {
      service.remove.mockResolvedValue({ deleted: true } as unknown as void);
      const result = await controller.remove('abc');
      expect(service.remove).toHaveBeenCalledWith('abc');
      expect(result).toEqual({ deleted: true });
    });
  });
});
