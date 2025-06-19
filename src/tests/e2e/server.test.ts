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

describe('POST /orders', () => {
    let server: Server;

    beforeAll(async () => {
        const dbUrl: string = process.env.DB_URL || 'mongodb://127.0.0.1:27017/db_orders_test';
        server = await createServer(3003, dbUrl)
    });

    afterAll(() => {
        server.close()
    })

    it('should create a new order successfully', async () => {
        const order = {
            items: [{
                productId: '1',
                quantity: 1,
                price: 100
            }],
            shippingAddress: 'Irrelevant street 123'
        }

        const response = await request(server)
            .post('/orders')
            .send(order)

        expect(response.status).toBe(200);
        expect(response.text).toBe('Order created with total: 100');
    })

    it('create a new order whit discount successfully', async () => {
        const order = {
            items: [{
                productId: '1',
                quantity: 1,
                price: 100
            }],
            shippingAddress: 'Irrelevant street 123',
            discountCode: 'DISCOUNT20'
        }

        const response = await request(server)
            .post('/orders')
            .send(order)
        expect(response.status).toBe(200);
        expect(response.text).toBe('Order created with total: 80');
    })
})

