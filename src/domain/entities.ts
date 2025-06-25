import {Address, Id, OrderLine, PositiveNumber} from "./valueObject";
import {DiscountCode, OrderStatus} from "./models";
import {DomainError} from "./error";

type OrderDTO = {
    id: string;
    items: { productId: string; quantity: number; price: number }[];
    shippingAddress: string;
    status: OrderStatus;
    discountCode: "DISCOUNT20" | undefined
};

export class Order {
    constructor(
        readonly id: Id,
        readonly items: OrderLine[],
        readonly shippingAddress: Address,
        private status: OrderStatus,
        readonly discountCode?: DiscountCode,
        readonly total?: number
    ) {}

    static create(items: OrderLine[], shippingAddress: Address, discountCode?: DiscountCode): Order {
        if (items.length === 0) {
            throw new DomainError('The order must have at least one item');
        }
        return new Order(Id.create(), items, shippingAddress, OrderStatus.Created, discountCode);
    }

    static fromDTO(dto: OrderDTO) {
        return new Order(
            Id.from(dto.id),
            dto.items.map(item => new OrderLine(
                Id.from(item.productId),
                PositiveNumber.create(item.quantity),
                PositiveNumber.create(item.price)
            )),
            Address.create(dto.shippingAddress),
            dto.status,
            dto.discountCode,
        )
    }

    calculatesTotal() {
        // return this.items[0].calculateSubTotal()
        const total = this.items.reduce((total: PositiveNumber, item) =>
            total.add(item.calculateSubTotal()), PositiveNumber.create(0));

        if (this.discountCode === 'DISCOUNT20') {
            return total.multiply(PositiveNumber.create(0.8))
        }

        return total
    }

    complete() {
        if(this.status !== OrderStatus.Created) {
            throw new DomainError(`Cannot complete an order with status: ${this.status} can be completed`);
        }

        this.status = OrderStatus.Completed;
    }

    isCompleted() {
        return this.status === OrderStatus.Completed;
    }

    toDTO() {
        return {
            id: this.id.value,
            items: this.items.map(item => ({
                productId: item.productId.value,
                quantity: item.quantity.value,
                price: item.price.value
            })),
            shippingAddress: this.shippingAddress.value,
            status: this.status,
            discountCode: this.discountCode,
        }
    }
}