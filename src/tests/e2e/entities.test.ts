import { Order } from "../../domain/entities";
import {Address, Id, OrderLine, PositiveNumber} from "../../domain/valueObject";
import {OrderStatus} from "../../domain/models";

describe('The order', () => {
    it('creates an order with the given fields are valid', () => {
        const items = [
            new OrderLine(Id.create().value, PositiveNumber.create(2), PositiveNumber.create(3 )),
            new OrderLine(Id.create().value, PositiveNumber.create(1), PositiveNumber.create(2 )),
        ];

        const discountCode = 'DISCOUNT20';
        const shippingAddress = Address.create('123 Main St, Springfield, USA');

        const order = Order.create(items, shippingAddress, discountCode);

        expect(order).toBeDefined();
        expect(order.id).toBeDefined();
        expect(order.items).toEqual(items);
        expect(order.shippingAddress).toEqual(shippingAddress);
        expect(order.discountCode).toEqual(discountCode);
        expect(order.status).toBe(OrderStatus.Created);
    })

    it('does not allow an order when no items are provided', () => {
        const items:OrderLine[] = [];
        const shippingAddress = Address.create('123 Main St, Springfield, USA');

        expect(() => Order.create(items, shippingAddress)).toThrow('The order must have at least one item');
    })
})