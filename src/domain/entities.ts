import {Address, Id, OrderLine} from "./valueObject";
import {DiscountCode, OrderStatus} from "./models";

export class Order {
    constructor(
        readonly id: Id,
        readonly items: OrderLine[],
        readonly shippingAddress: Address,
        readonly status: OrderStatus,
        readonly discountCode?: DiscountCode,
        readonly total?: number
    ) {}

    static create(
        items: OrderLine[],
        shippingAddress: Address,
        discountCode?: DiscountCode,
    ): Order {
        return new Order(Id.create(), items, shippingAddress, OrderStatus.Created, discountCode);
    }
}