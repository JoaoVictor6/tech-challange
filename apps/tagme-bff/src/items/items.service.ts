import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Item, ItemDocument } from './schemas/item.schema';
import { Model } from 'mongoose';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>) { }

  private static BuildPrefixFilter(
    field: string,
    prefix?: string,
  ): Record<string, unknown> {
    if (!prefix || typeof prefix !== 'string' || prefix.trim() === '') {
      return {};
    }

    const sanitize = (input: string) =>
      input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return {
      [ field ]: {
        $regex: '^' + sanitize(prefix),
        $options: 'i', // case-insensitive
      },
    };
  }
  async create(createItemDto: CreateItemDto): Promise<Item> {
    const createdItem = new this.itemModel(createItemDto);
    return createdItem.save();
  }

  async findAll({
    page: rawPage = 1,
    limit: rawLimit = 10,
    word
  }: {
    page: number;
    limit: number;
    word: string;
  }) {
    const normalizeValue = (value: number) => (value <= 0 ? 1 : value);
    const page = normalizeValue(rawPage);
    const limit = normalizeValue(rawLimit);
    const calcSkip = (page - 1) * limit;
    const skip = calcSkip < 0 ? 0 : calcSkip;

    const filter = ItemsService.BuildPrefixFilter('name', word);

    const [ items, totalCount ] = await Promise.all([
      this.itemModel.find(filter).skip(skip).limit(limit).exec(),
      this.itemModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: items,
      page,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const updatedItem = await this.itemModel
      .findByIdAndUpdate(id, updateItemDto, { new: true })
      .exec();

    if (!updatedItem) throw new NotFoundException('Item not found');
    return updatedItem;
  }

  async remove(id: string): Promise<void> {
    const result = await this.itemModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Item not found');
  }
}
