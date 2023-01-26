import CRYPTO from 'crypto';
import Utils from '../shared/utils';
import RedisRepository from '../repositories/redis';
import FileSystemRepository from '../repositories/fileSystem';

type Strategy = 'REDIS' | 'FILE_SYSTEM';
type Config = {
  algorithm: CRYPTO.CipherGCMTypes;
  password: string;
  authTagLength: number;
};

class Crypto {
  /* It's declaring a private property called _strategy and setting its type to
  Strategy. */
  private _strategy: Strategy;

  /* It's declaring a private property called _redis and setting its type to
  RedisRepository. */
  private _redis: RedisRepository;

  /* It's declaring a private property called _fileSystem and setting its type to
  FileSystemRepository. */
  private _fileSystem: FileSystemRepository;

  constructor() {
    this._strategy = 'REDIS';
    this._redis = new RedisRepository();
    this._fileSystem = new FileSystemRepository();
  }

  /**
   * It saves a value to the cache
   * @param {string} key - The key to store the value under.
   * @param {string} value - The value to be stored in the cache.
   * @returns A promise that resolves to the value of the key.
   */
  private async _save(key: string, value: string) {
    switch (this._strategy) {
      case 'REDIS':
        return await this._redis.set(key, value);
      case 'FILE_SYSTEM':
        return await this._fileSystem.set(key, value);
    }
  }

  /**
   * It saves a buffer to the cache
   * @param {string} key - The key to store the value under.
   * @param {Buffer} value - The value to be stored in the cache.
   * @returns A promise that resolves to a boolean value.
   */
  private async _saveBuffer(key: string, value: Buffer) {
    switch (this._strategy) {
      case 'REDIS':
        return await this._redis.setBuffer(key, value);
      case 'FILE_SYSTEM':
        return await this._fileSystem.setBuffer(key, value);
    }
  }

  /**
   * It loads a value from the cache, decompresses it, and returns it
   * @param {string} key - The key to store the value under.
   * @returns The value of the key in the cache.
   */
  private async _load(key: string): Promise<string> {
    switch (this._strategy) {
      case 'REDIS':
        return await this._redis.get(key);
      case 'FILE_SYSTEM':
        return await this._fileSystem.get(key);
    }
  }

  /**
   * It loads a buffer from the cache
   * @param {string} key - The key to store the value under.
   * @returns A promise that resolves to a buffer.
   */
  private async _loadBuffer(key: string): Promise<Buffer> {
    switch (this._strategy) {
      case 'REDIS':
        return await this._redis.getBuffer(key);
      case 'FILE_SYSTEM':
        return await this._fileSystem.getBuffer(key);
    }
  }

  /**
   * It takes a variable number of strings, serializes them, and then passes them to
   * the Redis client's `del` function
   * @param {string[]} key - The key to delete.
   * @returns The number of keys that were removed.
   */
  private async _delete(...key: string[]) {
    switch (this._strategy) {
      case 'REDIS':
        return await this._redis.del(...key);
      case 'FILE_SYSTEM':
        return await this._fileSystem.del(...key);
    }
  }

  /**
   * "The setStrategy function takes a Strategy object as an argument and assigns it
   * to the _strategy property."
   *
   * The setStrategy function is a setter function. It's a function that sets the
   * value of a property
   * @param {Strategy} strategy - Strategy - The strategy to use for the current
   * context.
   */
  public setStrategy(strategy: Strategy) {
    this._strategy = strategy;
  }

  /**
   * It encrypts a string using a password and saves the encrypted string, the
   * initialization vector, and the authentication tag to the database
   * @param {string} txt - The text to be encrypted
   * @param {string} password - The password used to encrypt the data.
   * @returns The encrypted text
   */
  public async encrypt(
    txt: string,
    password: string = process.env.CRYPTO_PASSWORD,
  ) {
    if (typeof txt !== 'string')
      return 'Error in encrypt: txt must be a string';

    const config: Config = {
        algorithm: 'aes-256-gcm',
        password,
        authTagLength: 16,
      },
      iv = Utils.createHash(Utils.getHash()),
      cipher = CRYPTO.createCipheriv(
        config.algorithm,
        Utils.createHash(password || config.password),
        iv,
        { authTagLength: config.authTagLength },
      );

    let encrypted = cipher.update(txt, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();
    const key = `${encrypted}-${password}`;

    await this._save(`${key}-iv`, iv);
    await this._saveBuffer(`${key}-tag`, tag);

    return encrypted;
  }

  /**
   * It decrypts the encrypted string using the password and the IV and the tag
   * @param {string} encrypted - The encrypted string
   * @param {string} password - The password used to encrypt the data.
   * @param {boolean} [del] - boolean - if true, the IV and tag will be deleted
   * from the cache.
   * @returns The decrypted text.
   */
  public async decrypt(
    encrypted: string,
    password: string = process.env.CRYPTO_PASSWORD,
    del?: boolean,
  ) {
    try {
      const key = `${encrypted}-${password}`;
      const keyIV = `${key}-iv`;
      const KeyTAG = `${key}-tag`;
      const iv = await this._load(keyIV);
      const tag = await this._loadBuffer(KeyTAG);

      if (del) await this._delete(keyIV, KeyTAG);

      const config: Config = {
          algorithm: 'aes-256-gcm',
          password,
          authTagLength: 16,
        },
        decipher = CRYPTO.createDecipheriv(
          config.algorithm,
          Utils.createHash(password || config.password),
          iv,
          { authTagLength: config.authTagLength },
        );

      decipher.setAuthTag(tag);

      let txt = decipher.update(encrypted, 'hex', 'utf8');

      txt += decipher.final('utf8');

      return txt;
    } catch (error) {
      return `Error ${error}`;
    }
  }
}

export default Crypto;
