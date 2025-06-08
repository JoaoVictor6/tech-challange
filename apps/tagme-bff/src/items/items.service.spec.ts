import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ItemsService } from './items.service';
import { Item, ItemSchema, ItemDocument } from './schemas/item.schema';
import { Model } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('ItemsService', () => {
  let service: ItemsService;
  let model: Model<Item>;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([ { name: Item.name, schema: ItemSchema } ]),
      ],
      providers: [ ItemsService ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    model = module.get<Model<Item>>(getModelToken(Item.name));
  });

  afterEach(async () => {
    await model.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('should create and retrieve an item', async () => {
    const created = (await service.create({
      name: 'Test Item',
      description: 'A description',
      imageUrl: 'http://image.url',
    })) as ItemDocument;

    expect(created).toHaveProperty('_id');
    expect(created.name).toBe('Test Item');

    const found = await service.findOne(created._id as string);
    expect(found.name).toBe('Test Item');
  });
  it('verify params normalization', async () => {
    for (let i = 1; i <= 2; i++) {
      await service.create({
        name: `Item ${i}`,
        description: `Description ${i}`,
        imageUrl: `http://example.com/image-${i}.jpg`,
      });
    }

    const result = await service.findAll({ page: 0, limit: 0, word: '' });

    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(2);
  });
  it('should return paginated items with correct structure', async () => {
    for (let i = 1; i <= 25; i++) {
      await service.create({
        name: `Item ${i}`,
        description: `Description ${i}`,
        imageUrl: `http://example.com/image-${i}.jpg`,
      });
    }

    const page = 2;
    const limit = 10;

    const result = await service.findAll({ page, limit, word: '' });

    expect(result.data).toHaveLength(10);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(3);

    expect(result.data[ 0 ].name).toBe('Item 11');
    expect(result.data[ 9 ].name).toBe('Item 20');
  });

  it('should return items that start with a specific prefix (case-insensitive)', async () => {
    const names = [ 'Aluminum', 'Alucard', 'Aluno', 'Banana', 'aluguel' ];
    for (const name of names) {
      await service.create({
        name,
        description: `${name} description`,
        imageUrl: `http://example.com/${name.toLowerCase()}.jpg`,
      });
    }

    const result = await service.findAll({ page: 1, limit: 10, word: 'alu' });

    const resultNames = result.data.map(item => item.name);
    expect(resultNames).toEqual(
      expect.arrayContaining([ 'Aluminum', 'Alucard', 'Aluno', 'aluguel' ]),
    );
    expect(resultNames).not.toContain('Banana');
  });

  it('should return no items if prefix does not match any', async () => {
    const result = await service.findAll({ page: 1, limit: 10, word: 'xyz' });
    expect(result.data).toHaveLength(0);
    expect(result.totalPages).toBe(0);
  });

  it('should sanitize regex to avoid injection and still return matches', async () => {
    await service.create({
      name: 'SafeTest',
      description: 'Test for regex safety',
      imageUrl: 'http://example.com/safe.jpg',
    });

    const result = await service.findAll({
      page: 1,
      limit: 10,
      word: 'Safe.*',
    });

    expect(result.data).toHaveLength(0); // should not match as regex injection is sanitized
  });
});
