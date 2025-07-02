import {Request, Response} from 'express';
import {DomainError} from "../../domain/error";
import {Factory} from "../../factory";
import {OrderUseCase} from "../../application/orderUseCase";

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository()

    try {
        const requestOrder = req.body;
        let result = await new OrderUseCase(repo).createOrder(requestOrder);
        res.send(result);
    } catch (error) {
        if (error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send('Unexpected error');
    }
};

// Update order
export const updateOrder = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();

    try {
        const requestOrderUpdate = {...req.body, id: req.params.id};
        res.send(await new OrderUseCase(repo).updateOrder(requestOrderUpdate));
    } catch (error) {
        if (error instanceof DomainError) {
            return res.status(404).send(error.message);
        }
        res.status(500).send('Unexpected error');
    }
};

//Get All orders
export const getAllOrders = async (_req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();
    const ordersDTO = await new OrderUseCase(repo).getAllOrders();
    res.json(ordersDTO);
};

// Complete order
export const completeOrder = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();

    try {
        const { id } = req.params;
        res.send(await new OrderUseCase(repo).completeOrder(id));
    } catch (error) {
        if (error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send('Unexpected error');
    }
};

// Delete order
export const deleteOrder = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();

    try {
        const { id } = req.params;
        let result = await new OrderUseCase(repo).deleteOrder(id);
        res.send(result);
    }
    catch (error) {
        if (error instanceof DomainError) {
            return res.status(404).send(error.message);
        }
        res.status(500).send('Server error while deleting order');
    }
};