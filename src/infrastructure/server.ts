import express, {Request, RequestHandler, Response} from 'express';
// import mongoose from 'mongoose';
import {completeOrder, createOrder, deleteOrder, getAllOrders, updateOrder} from './controllers/orderController';
import {Factory} from "../factory";
// import {OrderUseCase} from "../application/orderUseCase";

export async function createServer(port: number) {
    // await mongoose
    //     .connect(dbUrl)
    //     .then(() => console.log('Connected to MongoDB'))
    //     .catch((err) => console.error('Error connecting to MongoDB:', err));

    // const repo = await Factory.getOrderRepository();
    // const orderUseCase = new OrderUseCase(repo);
    const orderUseCase = await Factory.createOrderUseCase();

    const app = express();
    app.use(express.json());

    app.post('/orders', ((req: Request, res: Response) => (async (req: Request, res: Response) => {
        return createOrder(orderUseCase, req, res);
    })(req, res)) as RequestHandler);
    app.get('/orders', ((req: Request, res: Response) => getAllOrders(orderUseCase, req, res)) as RequestHandler);
    app.put('/orders/:id', ((req: Request, res: Response) => (async (req: Request, res: Response) => {
        return await updateOrder(orderUseCase, req, res);
    })(req, res)) as RequestHandler);
    app.post('/orders/:id/complete', ((req: Request, res: Response) => (async (req: Request, res: Response) => {
        return completeOrder(orderUseCase, req, res);
    })(req, res)) as RequestHandler);
    app.delete('/orders/:id', ((req: Request, res: Response) => deleteOrder(orderUseCase, req, res)) as RequestHandler);
    app.get('/', ((req: Request, res: Response) => {
        console.log("GET /");
        res.send({ status: 'ok' });
    }) as RequestHandler);

    return app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
