import { config } from 'dotenv';

config();

import { Crypto } from '../controllers/index';

const crypto = new Crypto();

export default crypto;
