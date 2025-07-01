import {Request, Response} from 'express';
import {Address, Id, OrderLine, PositiveNumber} from "../../domain/valueObject";
import {Order} from "../../domain/entities";
import {DomainError} from "../../domain/error";
import {Factory} from "../../factory";
import {OrderRepository} from "../../domain/repositories";

async function createOrderUseCase(requestOrder:any, repo: OrderRepository) {
    const orderLines = requestOrder.items.map((item: any) => (
        new OrderLine(
            Id.from(item.productId),
            PositiveNumber.create(item.quantity),
            PositiveNumber.create(item.price)
        )
    ))
    const order = Order.create(orderLines, Address.create(requestOrder.shippingAddress), requestOrder.discountCode);

    await repo.save(order);
    return `Order created with total: ${order.calculatesTotal().value}`;
}

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository()

    try {
        const requestOrder = req.body;
        let result = await createOrderUseCase(requestOrder, repo);
        res.send(result);
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
    const repo = await Factory.getOrderRepository();

    try {
        const { id } = req.params;
        const order = await repo.findById(Id.from(id));

        if(!order) {
            throw new DomainError(`Order not found`)
        }

        const { status, shippingAddress, discountCode } = req.body;
        if (shippingAddress) {
            order.updateShippingAddress(Address.create(shippingAddress));
        }

        if (status) {
            order.updateStatus(status);
        }

        if(discountCode) {
            order.updateDiscountCode(discountCode);
        }

        await repo.save(order);
        res.send(`Order updated. New status: ${order.toDTO().status}`)
    } catch (error) {
        if (error instanceof DomainError) {
            return res.status(404).send(error.message);
        }
        res.status(500).send('Unexpected error');
    }
};

// Complete order
export const completeOrder = async (req: Request, res: Response) => {
    console.log("POST /orders/:id/complete");
    const repo = await Factory.getOrderRepository();

    try {
        const { id } = req.params;
        const order = await repo.findById(Id.from(id));

        if(!order) {
            throw new DomainError(`Order not found to complete with id: ${id}`)
        }
        order.complete();
        await repo.save(order);
        res.send(`Order with id ${order.toDTO().id} completed`);
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

    const repo = await Factory.getOrderRepository();

    try {
        const { id } = req.params;
        const order = await repo.findById(Id.from(id));

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
