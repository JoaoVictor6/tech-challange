import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Module, OnModuleDestroy } from '@nestjs/common';
import mongoose from 'mongoose';

@Module({})
export class MongooseMockModule implements OnModuleDestroy {
  private static mongod: MongoMemoryServer;

  static async forRoot() {
    this.mongod = await MongoMemoryServer.create();
    const uri = this.mongod.getUri();

    return MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri,
      }),
    });
  }

  async onModuleDestroy() {
    await mongoose.connection.close();
    if (MongooseMockModule.mongod) {
      await MongooseMockModule.mongod.stop();
    }
  }
}

