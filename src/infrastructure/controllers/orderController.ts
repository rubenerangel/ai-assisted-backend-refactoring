import { Request, Response } from 'express';
import { OrderModel } from '../repositories/orderModel';
import {OrderStatus} from "../../domain/models";
import {Address, Id, OrderLine, PositiveNumber} from "../../domain/valueObject";
import {Order} from "../../domain/entities";
import {DomainError} from "../../domain/error";
import {Factory} from "../../factory";

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
    console.log("POST /orders");

    const repo = await Factory.getOrderRepository()


    try {
        const { items, discountCode, shippingAddress } = req.body;
        const orderLines = items.map((item:any) => (
            new OrderLine(
                Id.from(item.productId),
                PositiveNumber.create(item.quantity),
                PositiveNumber.create(item.price)
            )
        ))
        const order = Order.create(orderLines, Address.create(shippingAddress), discountCode);
        // const orderDTO = order.toDTO();

        await repo.save(order);

        // const newOrder = new OrderModel({
        //     _id: orderDTO.id,
        //     items: orderDTO.items,
        //     discountCode: orderDTO.discountCode,
        //     shippingAddress: orderDTO.shippingAddress,
        //     total: order.calculatesTotal().value,
        // });
        //
        // await newOrder.save();


        res.send(`Order created with total: ${order.calculatesTotal().value}`);
    } catch (error) {
        if (error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send('Unexpected error');
    }
};

export const getAllOrders = async (_req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository()
    const orders = await repo.findAll();
    // console.log("GET /orders");
    // const orders = await OrderModel.find();

    const ordersDTO = orders.map(order => order.toDTO());
    res.json(ordersDTO);
};

// Update order
export const updateOrder = async (req: Request, res: Response) => {
    console.log("PUT /orders/:id");
    const { id } = req.params;
    const { status, shippingAddress, discountCode } = req.body;

    const order = await OrderModel.findById(id);
    if (!order) {
        return res.status(404).send('Order not found');
    }

    if (shippingAddress) {
        order.shippingAddress = shippingAddress;
    }

    if (status) {
        if (status === OrderStatus.Completed && order.items.length === 0) {
            return res.send('Cannot complete an order without items');
        }
        order.status = status;
    }

    if (discountCode) {
        order.discountCode = discountCode;
        if (discountCode === 'DISCOUNT20') {
            let newTotal = 0;
            for (const item of order.items) {
                newTotal += (item.price || 0) * (item.quantity || 0);
            }
            newTotal *= 0.8;
            order.total = newTotal;
        } else {
            console.log('Invalid or not implemented discount code');
        }
    }

    await order.save();
    res.send(`Order updated. New status: ${order.status}`);
};

// Complete order
export const completeOrder = async (req: Request, res: Response) => {
    console.log("POST /orders/:id/complete");
    try {
        const { id } = req.params;
        const orderDocument = await OrderModel.findById(id);
        if (!orderDocument) {
            return res.status(400).send(`Order not found to complete with id: ${id}`);
        }
        console.log('order', orderDocument);
        const orderDTO = {
            id: orderDocument._id,
            items: orderDocument.items,
            shippingAddress: orderDocument.shippingAddress,
            status: orderDocument.status as OrderStatus,
            discountCode: orderDocument.discountCode,
        }
        const order = Order.fromDTO(orderDTO);
        order.complete();
        const orderDTOToUpdate = order.toDTO();
        const orderDocumentToUpdate = new OrderModel({
            _id: orderDTOToUpdate.id,
            items: orderDTOToUpdate.items,
            shippingAddress: orderDTOToUpdate.shippingAddress,
            status: orderDTOToUpdate.status,
            discountCode: orderDTOToUpdate.discountCode,
            total: order.calculatesTotal().value, // Assuming you want to update the total as well
        })
        await OrderModel.findOneAndReplace({_id: id}, orderDocumentToUpdate, { new: true });
        res.send(`Order with id ${id} completed`);
    } catch (error) {
        if (error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send('Unexpected error');
    }

};

// Delete order
export const deleteOrder = async (req: Request, res: Response) => {
    console.log("DELETE /orders/:id");

    const repo = await Factory.getOrderRepository()
    const { id } = req.params;

    const order = await repo.findById(Id.from(id));

    try {
        // await order.findByIdAndDelete(id);
        // console.log('deleteOrder', deleteOrder)
        if(!order) {
            throw new DomainError('Order not found')
        }
        await repo.delete(order.getId())
        // await OrderModel.findByIdAndDelete(id);
        res.send('Order deleted');
    }
    catch (error) {
        if (error instanceof DomainError) {
            return res.status(404).send(error.message);
        }
        res.status(500).send('Server error while deleting order');
    }
};
