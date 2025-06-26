import dotenv from 'dotenv';
import {createServer} from "./infrastructure/server";

export const PORT: number = Number(process.env.PORT) || 3002;
export const DB_URL: string = process.env.DB_URL || 'mongodb://127.0.0.1:27017/db_orders'

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

if(!DB_URL || !PORT) {
    console.error('Missing environment variables.');
    process.exit(1);
}

createServer(PORT, DB_URL);