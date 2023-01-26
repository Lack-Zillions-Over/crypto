import LZUTF8 from 'lzutf8';
import CRYPTO from 'crypto';
import RANDOMSTRING from 'randomstring';

export class Utils {
  static createHash(data: string) {
    return CRYPTO.createHash('sha256')
      .update(data)
      .digest('base64')
      .slice(0, 32);
  }

  static getHash() {
    const hash = CRYPTO.createHash('md5');

    hash.update(RANDOMSTRING.generate(24));

    return hash.digest('hex');
  }

  static serialize(text: string) {
    return CRYPTO.createHash('sha256').update(text).digest('hex');
  }

  static compress<T>(value: T) {
    return LZUTF8.compress(JSON.stringify(value), {
      outputEncoding: 'Base64',
    });
  }

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
