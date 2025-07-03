import {OrderUseCase, RequestOrder} from "../../../application/orderUseCase";
import {InMemoryOrderRepository} from "../../../domain/repositories";
import {Address, Id, OrderLine, PositiveNumber} from "../../../domain/valueObject";
import {Order} from "../../../domain/entities";
import {OrderStatus} from "../../../domain/models";

describe('The order use case', () => {
    it('creates a new order for a given order request', async () => {
        // Arrange
        const requestOrder: RequestOrder = {
            items: [
                { productId: 'prod1', quantity: 2, price: 10 },
                { productId: 'prod2', quantity: 1, price: 20 }
            ],
            // discountCode: 'DISCOUNT20',
            shippingAddress: '123 Main St, Springfield, USA',
        }
        const repo = new InMemoryOrderRepository();
        const useCase = new OrderUseCase(repo);

        // Act
        const result = await useCase.createOrder(requestOrder);
        const orders = await repo.findAll();

        // Assert
        expect(result).toBe('Order created with total: 40');
        expect(orders.length).toBe(1);
    });

    it('creates a new order with a discount code', async () => {
        // Arrange
        const requestOrder: RequestOrder = {
            items: [
                { productId: 'prod1', quantity: 2, price: 10 },
                { productId: 'prod2', quantity: 1, price: 20 }
            ],
            discountCode: 'DISCOUNT20',
            shippingAddress: '123 Main St, Springfield, USA',
        }
        const repo = new InMemoryOrderRepository();
        const useCase = new OrderUseCase(repo);

        // Act
        const result = await useCase.createOrder(requestOrder);
        const orders = await repo.findAll();

        // Assert
        expect(result).toBe('Order created with total: 32'); // Assuming discount applies correctly
        expect(orders.length).toBe(1);
    })

    it('updates an order for a given order update request', async () => {
        // Arrange
        const order = createValidOrder();
        const repository = new InMemoryOrderRepository();
        await repository.save(order);

        // Act
        const useCase = new OrderUseCase(repository);
        const result = await useCase.updateOrder({
            id: order.getId().value,
            status: OrderStatus.Completed,
            shippingAddress: '456 Elm St, Springfield, USA',
        });
        const updatedOrder = await repository.findById(order.getId());

        // Assert
        expect(result).toBe('Order updated. New status: Completed');
        expect(updatedOrder?.toDTO().shippingAddress).toBe('456 Elm St, Springfield, USA');
    });

    it('gets all orders', async () => {
        // Arrange
        const order = createValidOrder();
        const repository = new InMemoryOrderRepository();
        await repository.save(order);

        // Act
        const useCase = new OrderUseCase(repository);
        const orders = await useCase.getAllOrders();

        // Assert
        expect(orders.length).toBe(1);
        expect(orders[0].id).toBe(order.getId().value);
    });
});

function createValidOrder() {
    const items = [
        new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3)),
    ];
    const address = Address.create('123 Main St, Springfield, USA');
    return Order.create(items, address);
}