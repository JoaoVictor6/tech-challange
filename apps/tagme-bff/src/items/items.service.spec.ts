import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ItemsService } from './items.service';
import { Item, ItemSchema } from './schemas/item.schema';
import { NotFoundException } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { CreateItemDto } from './dto/create-item.dto';

const mockItemModel = () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  save: jest.fn(),
  constructor: jest.fn()
});

const mockItem = { _id: '1', name: 'Test', save: jest.fn() };

describe('ItemsService', () => {
  let service: ItemsService;
  let model: any;
  let mongod: MongoMemoryServer;
  let module: TestingModule;

  describe('Unit Tests with Mocks', () => {
    beforeEach(async () => {
      module = await Test.createTestingModule({
        providers: [
          ItemsService,
          {
            provide: getModelToken(Item.name),
            useFactory: mockItemModel,
          },
        ],
      }).compile();

      service = module.get<ItemsService>(ItemsService);
      model = module.get(getModelToken(Item.name));
    });

    describe('findAll', () => {
      it('should return paginated results with default values', async () => {
        model.find.mockReturnValue({ skip: () => ({ limit: () => ({ exec: () => [ mockItem ] }) }) });
        model.countDocuments.mockReturnValue({ exec: () => 1 });

        const result = await service.findAll({ page: undefined as unknown as number, limit: undefined as unknown as number, word: '' });
        expect(result).toEqual({ data: [ mockItem ], page: 1, totalPages: 1 });
      });

      it.each([
        { page: -1, limit: -5 },
        { page: 0, limit: 0 },
      ])('should normalize invalid page/limit values: %#', async ({ page, limit }) => {
        model.find.mockReturnValue({ skip: () => ({ limit: () => ({ exec: () => [ mockItem ] }) }) });
        model.countDocuments.mockReturnValue({ exec: () => 1 });

        const result = await service.findAll({ page, limit, word: '' });
        expect(result.page).toBe(1);
        expect(result.totalPages).toBe(1);
      });

      it('should apply case-insensitive regex filter', async () => {
        model.find.mockImplementation((filter) => {
          expect(filter.name.$regex).toBe('^Test'); // Confirma que a string esperada está correta
          expect(filter.name.$options).toBe('i');
          return { skip: () => ({ limit: () => ({ exec: () => [ mockItem ] }) }) };
        });
        model.countDocuments.mockReturnValue({ exec: () => 1 });

        await service.findAll({ page: 1, limit: 10, word: 'Test' });
      });
    });

    describe('findOne', () => {
      it('should return item if found', async () => {
        model.findById.mockReturnValue({ exec: () => mockItem });
        const result = await service.findOne('1');
        expect(result).toEqual(mockItem);
      });

      it('should throw NotFoundException if item is not found', async () => {
        model.findById.mockReturnValue({ exec: () => null });
        await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      });
    });

    describe('update', () => {
      it('should return updated item if found', async () => {
        model.findByIdAndUpdate.mockReturnValue({ exec: () => mockItem });
        const result = await service.update('1', { name: 'Updated' });
        expect(result).toEqual(mockItem);
      });

      it('should throw NotFoundException if item is not found', async () => {
        model.findByIdAndUpdate.mockReturnValue({ exec: () => null });
        await expect(service.update('999', { name: 'X' })).rejects.toThrow(NotFoundException);
      });
    });

    describe('remove', () => {
      it('should succeed if item is found', async () => {
        model.findByIdAndDelete.mockReturnValue({ exec: () => mockItem });
        await expect(service.remove('1')).resolves.toBeUndefined();
      });

      it('should throw NotFoundException if item not found', async () => {
        model.findByIdAndDelete.mockReturnValue({ exec: () => null });
        await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('Integration Tests with in-memory MongoDB', () => {
    beforeAll(async () => {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();

      module = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(uri),
          MongooseModule.forFeature([ { name: Item.name, schema: ItemSchema } ]),
        ],
        providers: [ ItemsService ],
      }).compile();

      service = module.get<ItemsService>(ItemsService);
    });

    afterAll(async () => {
      await mongoose.connection.close();
      await mongod.stop();
    });

    it('should create and retrieve an item from real db', async () => {
      const item = await service.create({ name: 'Banana', imageUrl: 'banana.png' } as unknown as CreateItemDto & { imageUrl: string }) as unknown as { _id: string };
      const found = await service.findOne(item._id.toString());

      expect(found.name).toBe('Banana');
    });

    it('should update an item in db', async () => {
      const item = await service.create({ name: 'Orange', imageUrl: 'orange.png' } as unknown as CreateItemDto & { imageUrl: string }) as unknown as { _id: string };
      const updated = await service.update(item._id.toString(), { name: 'Updated Orange' });

      expect(updated.name).toBe('Updated Orange');
    });

    it('should delete an item in db', async () => {
      const item = await service.create({ name: 'ToDelete', imageUrl: 'del.png' } as unknown as CreateItemDto & { imageUrl: string }) as unknown as { _id: string };
      await service.remove(item._id.toString());
      await expect(service.findOne(item._id.toString())).rejects.toThrow(NotFoundException);
    });
  });
});
