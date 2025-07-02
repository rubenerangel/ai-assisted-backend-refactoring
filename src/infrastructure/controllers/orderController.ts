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

async function getAllOrdersUseCase(repo: OrderRepository) {
    const orders = await repo.findAll();
    return orders.map(order => order.toDTO());
}

async function updateOrderUseCase(repo: OrderRepository, requestOrderUpdate:any) {
    const order = await repo.findById(Id.from(requestOrderUpdate.id)) as Order;

    if(!order) {
        throw new DomainError(`Order not found`)
    }
    if (requestOrderUpdate.shippingAddress) {
        order.updateShippingAddress(Address.create(requestOrderUpdate.shippingAddress));
    }
    if (requestOrderUpdate.status) {
        order.updateStatus(requestOrderUpdate.status);
    }
    if (requestOrderUpdate.discountCode) {
        order.updateDiscountCode(requestOrderUpdate.discountCode);
    }

    await repo.save(order);
    return `Order updated. New status: ${order.toDTO().status}`;
}

async function completeOrderUseCase(repo: OrderRepository, id: string) {
    const order = await repo.findById(Id.from(id)) as Order;

    if(!order) {
        throw new DomainError(`Order not found to complete with id: ${id}`)
    }
    order.complete();
    await repo.save(order);
    return `Order with id ${order.toDTO().id} completed`;
}

async function deleteOrderUseCase(repo: OrderRepository, id: string) {
    const order = await repo.findById(Id.from(id)) as Order;

    if(!order) {
        throw new DomainError('Order not found')
    }
    await repo.delete(order.getId())
    return 'Order deleted';
}

export const getAllOrders = async (_req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();
    const ordersDTO = await getAllOrdersUseCase(repo);
    res.json(ordersDTO);
};

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

// Update order
export const updateOrder = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();

    try {
        const requestOrderUpdate = {...req.body, id: req.params.id};
        res.send(await updateOrderUseCase(repo, requestOrderUpdate));
    } catch (error) {
        if (error instanceof DomainError) {
            return res.status(404).send(error.message);
        }
        res.status(500).send('Unexpected error');
    }
};

// Complete order
export const completeOrder = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();

    try {
        const { id } = req.params;
        res.send(await completeOrderUseCase(repo, id));
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
        let result = await deleteOrderUseCase(repo, id);
        res.send(result);
    }
    catch (error) {
        if (error instanceof DomainError) {
            return res.status(404).send(error.message);
        }
        res.status(500).send('Server error while deleting order');
    }
};
