import {OrderUseCase, RequestOrder} from "../../../application/orderUseCase";
import {InMemoryOrderRepository} from "../../../domain/repositories";

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
        const order = new OrderUseCase(repo);

        // Act
        const result = await order.createOrder(requestOrder);
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
        const order = new OrderUseCase(repo);

        // Act
        const result = await order.createOrder(requestOrder);
        const orders = await repo.findAll();

        // Assert
        expect(result).toBe('Order created with total: 32'); // Assuming discount applies correctly
        expect(orders.length).toBe(1);
    })
});