import fs from 'fs';
import path from 'path';
import Repository from './repository';
import Utils from '../shared/utils';

export default class FileSystemRepository implements Repository.Contract {
  /* It's setting a default value for the key if it doesn't exist. */
  private _defaultValue = '???';

  /**
   * It returns the path to the file that will be used to store the data
   * @param {string} [key] - The key to use for the data file.
   * @returns The path to the file.
   */
  private _getPath(key?: string) {
    const filePath = path.resolve(
      path.dirname(require.main.filename),
      `../data/${key ?? 'crypto'}.data`,
    );

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath));
    }

    return filePath;
  }

  /**
   * It takes a key and a value, and returns a string in the format of key=value
   * @param {string} key - The key of the key-value pair.
   * @param {string} value - The value of the key-value pair.
   * @returns A string with the key and value separated by an equals sign.
   */
  private _formatLine(key: string, value: string) {
    return `${key}=${value}`;
  }

  /**
   * It takes a line of text, splits it on the equals sign, and then returns the
   * second half of the split line after it's been decompressed
   * @param {string} line - The line of the file that is being read.
   * @returns The value of the line.
   */
  private _valueLine(line: string) {
    return Utils.decompress<string>(line.split('=')[1]);
  }

  /**
   * It reads the file, splits it into lines, and then returns the value of the
   * line that starts with the key
   * @param {string} key - The key to search for in the file.
   * @returns The value of the key in the file.
   */
  private _findLine(key: string) {
    const path = this._getPath();

    if (!fs.existsSync(path)) {
      return this._defaultValue;
    }

    const file = fs.readFileSync(path, 'utf8');
    const lines = file.split('\n');

    for (const line of lines) {
      if (line.split('=')[0] === key) {
        return this._valueLine(line);
      }
    }

    return this._defaultValue;
  }

  /**
   * It removes a line from a file
   * @param {string} key - The key to remove from the file.
   * @returns A boolean value.
   */
  private _removeLine(key: string) {
    const path = this._getPath();

    if (!fs.existsSync(path)) {
      return false;
    }

    const file = fs.readFileSync(path, 'utf8');
    const lines = file.split('\n').filter((line) => !line.startsWith(key));

    fs.writeFileSync(path, lines.join('\n'), 'utf8');
    return true;
  }

  /**
   * It takes a key and a value, formats them into a line, and appends that line to
   * the end of the file
   * @param {string} key - The key to store the value under.
   * @param {string} value - The value to be stored.
   * @returns The line that was appended to the file.
   */
  async set(key: string, value: string): Promise<string> {
    const path = this._getPath();
    const line = this._formatLine(Utils.serialize(key), Utils.compress(value));

    fs.appendFileSync(path, line, 'utf8');
    return line;
  }

  /**
   * It returns the value of the key that is passed in
   * @param {string} key - The key to search for.
   * @returns The value of the key.
   */
  async get(key: string): Promise<string> {
    return this._findLine(Utils.serialize(key));
  }

  /**
   * It takes a key and a value, and it appends the value to the file at the path
   * that corresponds to the key
   * @param {string} key - The key to store the value under.
   * @param {Buffer} value - The value to be stored.
   * @returns The value of the key.
   */
  async setBuffer(key: string, value: Buffer): Promise<Buffer> {
    const path = this._getPath(Utils.serialize(key));

    fs.appendFileSync(path, value, 'hex');
    return value;
  }

  /**
   * It reads the file at the given path, converts it to a buffer, and returns it
   * @param {string} key - The key to store the value under.
   * @returns A buffer of the file.
   */
  async getBuffer(key: string): Promise<Buffer> {
    const path = this._getPath(Utils.serialize(key));

    const file = fs.readFileSync(path, 'hex');

    return Buffer.from(file, 'hex');
  }

  /**
   * It deletes the specified keys from the database
   * @param {string[]} keys - string[]
   * @returns The number of keys that were deleted.
   */
  async del(...keys: string[]): Promise<number> {
    let count = 0;

    for (const key of keys) {
      const serialize = Utils.serialize(key);
      const checkIsBuffer = fs.existsSync(this._getPath(serialize));

      if (checkIsBuffer) {
        fs.unlinkSync(this._getPath(serialize));
        count++;
      } else {
        if (this._removeLine(serialize)) count++;
      }
    }

    return count;
  }
}
