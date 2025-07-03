import {DiscountCode, OrderStatus} from "../domain/models";
import {OrderRepository} from "../domain/repositories";
import {Address, Id, OrderLine, PositiveNumber} from "../domain/valueObject";
import {Order} from "../domain/entities";
import {DomainError} from "../domain/error";

export type RequestOrder = {
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    shippingAddress: string;
    discountCode?: DiscountCode;
}

export type RequestOrderUpdate = {
    id: string;
    shippingAddress?: string;
    status: OrderStatus;
    discountCode?: DiscountCode;
}

export class OrderUseCase {
    constructor(private repo: OrderRepository) {}

    async createOrder(requestOrder: RequestOrder) {
        const orderLines = requestOrder.items.map((item: any) => (
            new OrderLine(
                Id.from(item.productId),
                PositiveNumber.create(item.quantity),
                PositiveNumber.create(item.price)
            )
        ))
        const order = Order.create(orderLines, Address.create(requestOrder.shippingAddress), requestOrder.discountCode);

        await this.repo.save(order);
        return `Order created with total: ${order.calculatesTotal().value}`;
    }

    async updateOrder(requestOrderUpdate: RequestOrderUpdate) {
        const order = await this.repo.findById(Id.from(requestOrderUpdate.id)) as Order;

        if (!order) {
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

        await this.repo.save(order);
        return `Order updated. New status: ${order.toDTO().status}`;
    }

    async getAllOrders() {
        const orders = await this.repo.findAll();
        return orders.map(order => order.toDTO());
    }

    async completeOrder(id: string) {
        const order = await this.repo.findById(Id.from(id)) as Order;

        if (!order) {
            throw new DomainError(`Order not found to complete with id: ${id}`)
        }
        order.complete();
        await this.repo.save(order);
        return `Order with id ${order.toDTO().id} completed`;
    }

    async deleteOrder(id: string) {
        const order = await this.repo.findById(Id.from(id)) as Order;

        if (!order) {
            throw new DomainError('Order not found')
        }
        await this.repo.delete(order.getId())
        return 'Order deleted';
    }
}