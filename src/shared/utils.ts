import LZUTF8 from 'lzutf8';
import CRYPTO from 'crypto';
import RANDOMSTRING from 'randomstring';

export class Utils {
  /**
   * It takes a string, creates a hash of it, and returns the first 32 characters
   * of the hash
   * @param {string} data - The data to be hashed.
   * @returns A hash of the data
   */
  static createHash(data: string) {
    return CRYPTO.createHash('sha256')
      .update(data)
      .digest('base64')
      .slice(0, 32);
  }

  /**
   * It creates a hash using the md5 algorithm, updates it with a random string,
   * and then returns the hexadecimal digest
   * @returns A random string of 24 characters.
   */
  static getHash() {
    const hash = CRYPTO.createHash('md5');

    hash.update(RANDOMSTRING.generate(24));

    return hash.digest('hex');
  }

  /**
   * It takes a string, creates a hash of it, and returns the hash
   * @param {string} text - The text to be hashed.
   * @returns A hash of the text
   */
  static serialize(text: string) {
    return CRYPTO.createHash('sha256').update(text).digest('hex');
  }

  /**
   * It takes a value of type T, converts it to a string, compresses the string,
   * and returns the compressed string
   * @param {T} value - The value to be compressed.
   * @returns A string
   */
  static compress<T>(value: T) {
    return LZUTF8.compress(JSON.stringify(value), {
      outputEncoding: 'Base64',
    });
  }

  /**
   * It takes a string, decompresses it, and returns the result
   * @param {string} value - The string to be decompressed.
   * @returns The decompressed value.
   */
  static decompress<T>(value: string): T {
    return JSON.parse(
      LZUTF8.decompress(value, {
        inputEncoding: 'Base64',
        outputEncoding: 'String',
      }),
    );
  }
}

export default Utils;
