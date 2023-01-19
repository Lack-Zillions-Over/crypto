import { Crypto } from '../index';

const texts = {
  string: 'John Doe',
  number: Number(123).toString(),
  boolean: String(true),
  object: JSON.stringify({ name: 'John Doe' }),
  buffer: Buffer.from('John Doe').toString(),
};

jest.mock('ioredis', () => {
  const mockData: Record<string, string | Buffer> = {};

  return jest.fn().mockImplementation(() => {
    return {
      set: jest.fn((key: string, value: string) => {
        mockData[key] = value;
        return true;
      }),
      get: jest.fn((key: string) => {
        return mockData[key];
      }),
      setBuffer: jest.fn((key: string, value: Buffer) => {
        mockData[key] = value;
        return true;
      }),
      getBuffer: jest.fn((key: string) => {
        return mockData[key];
      }),
      del: jest.fn((key: string) => {
        delete mockData[key];
        return true;
      }),
    };
  });
});

describe('Crypto Suite Tests', () => {
  describe('Encrypt/Decrypt', () => {
    it('should be encrypt string', async () => {
      await expect(Crypto.encrypt(texts.string)).resolves.not.toBe(
        texts.string,
      );
    });

    it('should be decrypt string', async () => {
      const encrypted = await Crypto.encrypt(texts.string);
      await expect(Crypto.decrypt(encrypted)).resolves.toBe(texts.string);
    });

    it('should be encrypt object', async () => {
      await expect(Crypto.encrypt(texts.object)).resolves.not.toBe(
        texts.object,
      );
    });

    it('should be decrypt object', async () => {
      const encrypted = await Crypto.encrypt(texts.object);
      await expect(Crypto.decrypt(encrypted)).resolves.toBe(texts.object);
    });

    it('should be encrypt number', async () => {
      await expect(Crypto.encrypt(texts.number)).resolves.not.toBe(
        texts.number,
      );
    });

    it('should be decrypt number', async () => {
      const encrypted = await Crypto.encrypt(texts.number);
      await expect(Crypto.decrypt(encrypted)).resolves.toBe(texts.number);
    });

    it('should be encrypt boolean', async () => {
      await expect(Crypto.encrypt(texts.boolean)).resolves.not.toBe(
        texts.boolean,
      );
    });

    it('should be decrypt boolean', async () => {
      const encrypted = await Crypto.encrypt(texts.boolean);
      await expect(Crypto.decrypt(encrypted)).resolves.toBe(texts.boolean);
    });

    it('should be encrypt buffer', async () => {
      await expect(Crypto.encrypt(texts.buffer)).resolves.not.toBe(
        texts.buffer,
      );
    });

    it('should be decrypt buffer', async () => {
      const encrypted = await Crypto.encrypt(texts.buffer);
      await expect(Crypto.decrypt(encrypted)).resolves.toBe(texts.buffer);
    });
  });

  describe('Fail tests', () => {
    it('should be fail encrypt', async () => {
      await expect(Crypto.encrypt(eval(String(500)))).resolves.toBe(
        'Error in encrypt: txt must be a string',
      );
    });

    it('should be fail decrypt', async () => {
      await expect(Crypto.decrypt('testing')).resolves.toBe(
        'Error TypeError: decompress: undefined or null input received',
      );
    });
  });
});
