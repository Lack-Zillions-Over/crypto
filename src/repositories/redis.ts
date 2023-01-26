import Redis from 'ioredis';
import Repository from './repository';
import Utils from '../shared/utils';

export default class RedisRepository implements Repository.Contract {
  /* A private variable that is used to store the Redis client. */
  private _client: Redis;

  constructor() {
    this._client = new Redis(process.env.REDIS_URL, {
      password: process.env.REDIS_PASSWORD,
    });
  }

  /**
   * It takes a key and a value, serializes the key, compresses the value, and then
   * sets the key and value in the Redis database
   * @param {string} key - The key to store the value under.
   * @param {string} value - The value to be stored in the cache.
   * @returns The value of the key that was set.
   */
  async set(key: string, value: string): Promise<string> {
    return await this._client.set(Utils.serialize(key), Utils.compress(value));
  }

  /**
   * It gets a value from the cache, decompresses it, and returns it
   * @param {string} key - The key to get the value for.
   * @returns The value of the key in the cache.
   */
  async get(key: string): Promise<string> {
    return Utils.decompress(await this._client.get(Utils.serialize(key)));
  }

  /**
   * It sets a buffer value in the cache.
   * @param {string} key - The key to set the value to.
   * @param {Buffer} value - The value to be stored in the cache.
   * @returns The value of the key.
   */
  async setBuffer(key: string, value: Buffer): Promise<Buffer> {
    return await this._client.setBuffer(Utils.serialize(key), value, 'GET');
  }

  /**
   * Get the value of a key as a Buffer.
   * @param {string} key - The key to get the value for.
   * @returns A promise that resolves to a buffer.
   */
  async getBuffer(key: string): Promise<Buffer> {
    return await this._client.getBuffer(Utils.serialize(key));
  }

  /**
   * It takes a list of keys, serializes them, and then passes them to the
   * underlying Redis client
   * @param {string[]} keys - string[] - An array of keys to delete.
   * @returns The number of keys that were removed.
   */
  async del(...keys: string[]): Promise<number> {
    return await this._client.del(...keys.map((k) => Utils.serialize(k)));
  }
}
