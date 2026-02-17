import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, afterAll, afterEach } from '@jest/globals';

declare const jest: { setTimeout: (ms: number) => void };

let mongoServer: MongoMemoryServer;

export async function connect(): Promise<string> {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);
  return uri;
}

export async function disconnect(): Promise<void> {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
}

export async function clearCollections(): Promise<void> {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

beforeAll(async () => {
  jest.setTimeout(60000);
  const uri = await connect();
  console.log(`MongoDB Memory Server started at: ${uri}`);
});

afterAll(async () => {
  jest.setTimeout(30000);
  await disconnect();
});

afterEach(async () => {
  await clearCollections();
});
