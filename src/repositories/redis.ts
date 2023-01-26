import Redis from 'ioredis';
import Repository from './repository';
import Utils from '../shared/utils';

export default class RedisRepository implements Repository.Contract {
  private _client: Redis;

  constructor() {
    this._client = new Redis(process.env.REDIS_URL, {
      password: process.env.REDIS_PASSWORD,
    });
  }

  async set(key: string, value: string): Promise<string> {
    return await this._client.set(Utils.serialize(key), Utils.compress(value));
  }

  async get(key: string): Promise<string> {
    console.log(await this._client.get(Utils.serialize(key)));
    return Utils.decompress(await this._client.get(Utils.serialize(key)));
  }

  async setBuffer(key: string, value: Buffer): Promise<Buffer> {
    return await this._client.setBuffer(Utils.serialize(key), value, 'GET');
  }

  async getBuffer(key: string): Promise<Buffer> {
    return await this._client.getBuffer(Utils.serialize(key));
  }

  async del(...keys: string[]): Promise<number> {
    return await this._client.del(...keys.map((k) => Utils.serialize(k)));
  }
}
