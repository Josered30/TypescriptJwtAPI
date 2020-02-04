import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { startConnection } from './database';

async function main() {
    startConnection();
    await app.listen(app.get('port'));
    console.log('Listening from port: ', app.get('port'));
}

main();