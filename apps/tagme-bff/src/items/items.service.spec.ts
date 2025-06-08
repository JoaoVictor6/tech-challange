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

    const result = await service.findAll({ page: 0, limit: 0 });

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

    const result = await service.findAll({ page, limit });

    expect(result.data).toHaveLength(10);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(3);

    expect(result.data[ 0 ].name).toBe('Item 11');
    expect(result.data[ 9 ].name).toBe('Item 20');
  });
});
