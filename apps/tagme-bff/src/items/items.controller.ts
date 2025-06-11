import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { extname } from 'path';
import { setupPublicFolder } from 'src/setup-public-folder';
import { randomUUID } from 'crypto';

const MAX_FILE_SIZE = 1024 * 1024 // 1MB

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }
  private static fileMiddlewareSetup() {
    return FileInterceptor('image', {
      limits: { fileSize: MAX_FILE_SIZE },
      storage: diskStorage({
        destination: `./${setupPublicFolder.PUBLIC_FOLDER_NAME}`,
        filename: (req, file, callback) => {
          const uniqueSuffix = randomUUID();
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Tipo de arquivo inválido'), false);
        }
      },
    })
  }

  @Post()
  @UseInterceptors(ItemsController.fileMiddlewareSetup())
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createItemDto: CreateItemDto
  ) {
    return this.itemsService.create({ ...createItemDto, imageUrl: file.path });
  }

  @Get()
  findAll(@Query('page') rawPage = '1', @Query('pageSize') rawLimit = '10', @Query('word') word = '') {
    const page = parseInt(rawPage, 10);
    const limit = parseInt(rawLimit, 10);
    return this.itemsService.findAll({ page, limit, word });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(ItemsController.fileMiddlewareSetup())
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return this.itemsService.update(id, updateItemDto);
    }
    return this.itemsService.update(id, { ...updateItemDto, imageUrl: file.path });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
