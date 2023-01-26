namespace Repository {
  export abstract class Contract {
    abstract set(key: string, value: string): Promise<string>;
    abstract get(key: string): Promise<string>;
    abstract setBuffer(key: string, value: Buffer): Promise<Buffer>;
    abstract getBuffer(key: string): Promise<Buffer>;
    abstract del(...keys: string[]): Promise<number>;
  }
}

export default Repository;
