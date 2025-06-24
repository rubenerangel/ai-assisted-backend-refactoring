import {Address, Id, OrderLine, PositiveNumber} from "./valueObject";
import {DiscountCode, OrderStatus} from "./models";
import {DomainError} from "./error";

export class Order {
    constructor(
        readonly id: Id,
        readonly items: OrderLine[],
        readonly shippingAddress: Address,
        readonly status: OrderStatus,
        readonly discountCode?: DiscountCode,
        readonly total?: number
    ) {}

    static create(items: OrderLine[], shippingAddress: Address, discountCode?: DiscountCode): Order {
        if (items.length === 0) {
            throw new DomainError('The order must have at least one item');
        }
        return new Order(Id.create(), items, shippingAddress, OrderStatus.Created, discountCode);
    }

    calculatesTotal() {
        // return this.items[0].calculateSubTotal()
        const total = this.items.reduce((total: PositiveNumber, item) =>
            total.add(item.calculateSubTotal()), PositiveNumber.create(0));

        return this.applyDiscount(total);
    }

    private applyDiscount(total: PositiveNumber) {
        if (this.discountCode === 'DISCOUNT20') {
            return total.multiply(PositiveNumber.create(0.8))
        }

        return total
    }
}