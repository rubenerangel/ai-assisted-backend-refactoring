import request from 'supertest';
import {createServer} from '../../app';
import dotenv from "dotenv";
import {Server} from 'node:http'
import mongoose from "mongoose";
import {OrderStatus} from "../../domain/models";
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
        discountCode
    }

    await request(server)
        .post('/orders')
        .send(order);

    const response = await request(server)
        .get('/orders');

    return response.body[0];
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
        server = createServer(3003, dbUrl)
    });

    afterAll(() => {
        server.close()
    })

    it('should create a new order successfully', async () => {
        const order = {
            items: [
                {
                    productId: "1",
                    quantity: 1,
                    price: 100
                }
            ],
            shippingAddress: "Irrelevant Street 123",
        }

        const response = await request(server).post('/orders').send(order);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Order created with total: 100');
    })

    it('create a new order whit discount successfully', async () => {
        const order = {
            items: [
                {
                    productId: "1",
                    quantity: 1,
                    price: 100
                },
            ],
            discountCode: 'DISCOUNT20',
            shippingAddress: "Irrelevant Street 123",
        }

        const response = await request(server).post('/orders').send(order);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Order created with total: 80');
    })

    it('creates a new order successfully', async () => {
        const order = {
            items: [
                {
                    productId: "1",
                    quantity: 1,
                    price: 100
                }
            ],
            shippingAddress: "Irrelevant Street 123",
        };
        const response = await request(server).post('/orders').send(order);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Order created with total: 100');
    });

    it('creates a new order with discount successfully', async () => {
        const order = {
            items: [
                {
                    productId: "1",
                    quantity: 1,
                    price: 100
                }
            ],
            shippingAddress: "Irrelevant Street 123",
            discountCode: 'DISCOUNT20'
        };
        const response = await request(server).post('/orders').send(order);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Order created with total: 80');
    });

























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

describe('DELETE /orders/:id', () => {
    let server: Server;
    beforeAll(async () => {
        const dbUrl: string = process.env.DB_URL || 'mongodb://127.0.0.1:27017/db_orders_test';
        server = await createServer(3003, dbUrl)
    })

    afterAll(() => {
        server.close()
    })

    it('delete an order successfully', async () => {
        const order = await createAValidOrder(server);

        const deleteResponse = await request(server)
            .delete(`/orders/${order._id}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.text).toBe('Order deleted');
    })

    it('returns an error when trying to delete an order that does not exist order', async () => {
        const deleteResponse = await request(server)
            .delete(`/orders/123`);

        expect(deleteResponse.status).toBe(404);
        expect(deleteResponse.text).toBe('Order not found');
    })
})

describe('POST /orders/:id/complete', () => {
    let server: Server;

    beforeAll(async () => {
        const dbUrl: string = process.env.DB_URL || 'mongodb://127.0.0.1:27017/db_orders_test';
        server = await createServer(3003, dbUrl)
        await mongoose.connection.dropDatabase();
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    })

    afterAll(() => {
        server.close()
    })

    it('completes an order successfully', async () => {
        const order = await createAValidOrder(server);

        const completeResponse = await request(server)
            .post(`/orders/${order._id}/complete`);

        expect(completeResponse.status).toBe(200);
        expect(completeResponse.text).toBe(`Order with id ${order._id} completed`);
    })

    it('returns an error when trying to complete an order that does not exist', async () => {
        const completeResponse = await request(server)
            .post('/orders/123/complete');

        expect(completeResponse.status).toBe(400);
        expect(completeResponse.text).toBe('Order not found to complete with id: 123');
    })

    it('does not allow to complete an order with status different than CREATED', async () => {
        const order = await createAValidOrder(server);
        await request(server)
            .post(`/orders/${order._id}/complete`);

        const completeResponse = await request(server)
            .post(`/orders/${order._id}/complete`);

        expect(completeResponse.status).toBe(400);
        expect(completeResponse.text).toBe(`Cannot complete an order with status: Completed can be completed`);
    })
})

describe('PUT /orders/:id', () => {
    let server: Server;

    beforeAll(async () => {
        const dbUrl: string = process.env.DB_URL || 'mongodb://127.0.0.1:27017/db_orders_test';
        server = await createServer(3003, dbUrl)
        await mongoose.connection.dropDatabase();
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    })

    afterAll(() => {
        server.close()
    })

    it('updates a given valid order successfully', async () => {
        const order = await createAValidOrder(server);

        const updateResponse = await request(server)
            .put(`/orders/${order._id}`)
            .send({
                status: OrderStatus.Completed,
            });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.text).toBe(`Order updated. New status: Completed`);
    })

    it('updates an order with discount code successfully', async () => {
        const order = await createAValidOrder(server);

        const updateResponse = await request(server)
            .put(`/orders/${order._id}`)
            .send({
                discountCode: 'DISCOUNT20',
            });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.text).toBe('Order updated. New status: Created');
    })

    it('does not allow to update a non-existing order', async () => {
        const updateResponse = await request(server)
            .put('/orders/123')
            .send({
                status: OrderStatus.Completed,
            });

        expect(updateResponse.status).toBe(404);
        expect(updateResponse.text).toBe('Order not found');
    })

    it('updates an order with shipping address successfully', async () => {
        const order = await createAValidOrder(server);

        const updateResponse = await request(server)
            .put(`/orders/${order._id}`)
            .send({
                shippingAddress: 'New Address 456',
            });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.text).toBe('Order updated. New status: Created');
    })
})