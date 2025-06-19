import request from 'supertest';
import {createServer} from '../../app';
import dotenv from "dotenv";
import {Server} from 'node:http'

dotenv.config({path: '.env.test'});

describe('Status endpoint', () => {
    let server: Server;

    beforeAll(() => {
        const dbUrl: string = process.env.DB_URL || 'mongodb://127.0.0.1:27017/db_orders_test';
        const port: number = Number(process.env.PORT) || 3003;
        server = createServer(port, dbUrl)
    });

    afterAll(() => {
        server.close()
    })

    it('checks API health', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
});

