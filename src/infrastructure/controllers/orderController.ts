import {Request, Response} from 'express';
import {DomainError} from "../../domain/error";
import {OrderUseCase} from "../../application/orderUseCase";

// let repo:OrderRepository
// Create a new order
export const createOrder = async (orderUseCase: OrderUseCase, req: Request, res: Response) => {

    try {
        const requestOrder = req.body;
        let result = await orderUseCase.createOrder(requestOrder);
        res.send(result);
    } catch (error) {
        if (error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send('Unexpected error');
    }
};

//Get All orders
export const getAllOrders = async (orderUseCase: OrderUseCase, req: Request, res: Response) => {
    // const repo = await Factory.getOrderRepository();
    const ordersDTO = await orderUseCase.getAllOrders();
    res.json(ordersDTO);
};

// Update order
export const updateOrder = async (orderUseCase: OrderUseCase, req: Request, res: Response) => {
    // const repo = await Factory.getOrderRepository();

    try {
        const requestOrderUpdate = {...req.body, id: req.params.id};
        res.send(await orderUseCase.updateOrder(requestOrderUpdate));
    } catch (error) {
        if (error instanceof DomainError) {
            return res.status(404).send(error.message);
        }
        res.status(500).send('Unexpected error');
    }
};

// Complete order
export const completeOrder = async (orderUseCase: OrderUseCase, req: Request, res: Response) => {
    // const repo = await Factory.getOrderRepository();

    try {
        const { id } = req.params;
        res.send(await orderUseCase.completeOrder(id));
    } catch (error) {
        if (error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send('Unexpected error');
    }
};

// Delete order
export const deleteOrder = async (orderUseCase: OrderUseCase, req: Request, res: Response) => {
    // const repo = await Factory.getOrderRepository();

    try {
        const { id } = req.params;
        let result = await orderUseCase.deleteOrder(id);
        res.send(result);
    }
    catch (error) {
        if (error instanceof DomainError) {
            return res.status(404).send(error.message);
        }
        res.status(500).send('Server error while deleting order');
    }
};