import fs from 'fs';
import path from 'path';
import Repository from './repository';
import Utils from '../shared/utils';

export default class FileSystemRepository implements Repository.Contract {
  private _defaultValue = '???';

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

  private _formatLine(key: string, value: string) {
    return `${key}=${value}`;
  }

  private _valueLine(line: string) {
    return Utils.decompress<string>(line.split('=')[1]);
  }

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

  async set(key: string, value: string): Promise<string> {
    const path = this._getPath();
    const line = this._formatLine(Utils.serialize(key), Utils.compress(value));

    fs.appendFileSync(path, line, 'utf8');
    return line;
  }

  async get(key: string): Promise<string> {
    return this._findLine(Utils.serialize(key));
  }

  async setBuffer(key: string, value: Buffer): Promise<Buffer> {
    const path = this._getPath(Utils.serialize(key));

    fs.appendFileSync(path, value, 'hex');
    return value;
  }

  async getBuffer(key: string): Promise<Buffer> {
    const path = this._getPath(Utils.serialize(key));

    const file = fs.readFileSync(path, 'hex');

    return Buffer.from(file, 'hex');
  }

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
