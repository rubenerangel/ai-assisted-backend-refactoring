import request from 'supertest';
import {createServer} from '../../app';
import dotenv from "dotenv";
import {Server} from 'node:http'
import mongoose from "mongoose";
dotenv.config({path: '.env.test'});

async function createAValidOrder(server: Server, discountCode?: string) {
    const order = {
        items: [
            {
                productId: '1',
                quantity: 1,
                price: 100
            }
        ],
        shippingAddress: 'Irrelevant street 123',
        discountCode: discountCode
    }

    return await request(server)
        .post('/orders')
        .send(order);
}

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
        const response = await createAValidOrder(server);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Order created with total: 100');
    })

    it('create a new order whit discount successfully', async () => {
        const response = await createAValidOrder(server, 'DISCOUNT20');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Order created with total: 80');
    })

    it('does not allowed to create an order when missing items', async () => {
        const order = {
            items: [],
            shippingAddress: 'Irrelevant street 123'
        }

        const response = await request(server)
            .post('/orders')
            .send(order)
        expect(response.status).toBe(400);
        expect(response.text).toBe('The order must have at least one item');
    })
})

describe('GET /orders', () => {
    let server: Server;

    beforeAll(async () => {
        const dbUrl: string = process.env.DB_URL || 'mongodb://127.0.0.1:27017/db_orders_test';
        server = await createServer(3003, dbUrl)

        await mongoose.connection.dropDatabase();
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    })

    afterAll(() => {
        server.close()
    })

    it('list no orders when store is empty', async () => {
        const response = await request(server)
            .get('/orders');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    })

    it('list one order after creating it', async () => {
        await createAValidOrder(server);

        const response = await request(server)
            .get('/orders');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    })
})