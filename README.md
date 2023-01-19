# LZO: Crypto

> Data Encryption and Decryption.

[![Sponsor][sponsor-badge]][sponsor]
[![Commitizen friendly][commitizen-badge]][commitizen]
[![TypeScript version][ts-badge]][typescript-4-9]
[![Node.js version][nodejs-badge]][nodejs]
[![MIT][license-badge]][license]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]

## Installation

```bash
npm install lzo-crypto OR yarn add lzo-crypto
```

## Configuration

Please input the credentials of your Redis server in the `.env` file.

> See the example in the `.env.example` file.

```bash
REDIS_URL="redis://IP:PORT"
REDIS_PORT=6379
REDIS_PASSWORD="PASSWORD"
```

## Usage

```typescript
import { Crypto } from 'lzo-crypto';

const encrypted = await crypto.encrypt(
  'I have always feed my dog the dog food that comes in the big green bag.',
);

const decrypted = await crypto.decrypt(encrypted);

console.log(encrypted); // 77b3e7c6e42c057dac9809ac3513b519026af5e6cfb33dbb6
console.log(decrypted); // I have always feed my dog the dog food that comes in the big green bag.
```

## API

`Crypto.encrypt(txt: string, password?: string): Promise<string>`

> It encrypts a string using a password and saves the encrypted string, the initialization vector, and the authentication tag to the database

`Crypto.decrypt(encrypted: string, password?: string, del?: boolean): Promise<string>`

> It decrypts the encrypted string using the password and the IV and the tag

## Backers & Sponsors

Support this project by becoming a [sponsor][sponsor].

## License

Licensed under the MIT. See the [LICENSE](https://github.com/Lack-Zillions-Over/crypto/blob/main/LICENSE) file for details.

[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen]: http://commitizen.github.io/cz-cli/
[ts-badge]: https://img.shields.io/badge/TypeScript-4.9-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2018.12.1-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v18.x/docs/api/
[gha-badge]: https://github.com/Lack-Zillions-Over/crypto/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/Lack-Zillions-Over/crypto/actions/workflows/nodejs.yml
[typescript-4-9]: https://devblogs.microsoft.com/typescript/announcing-typescript-4-9/
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: https://github.com/Lack-Zillions-Over/crypto/blob/main/LICENSE
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[sponsor]: https://github.com/sponsors/Lack-Zillions-Over
