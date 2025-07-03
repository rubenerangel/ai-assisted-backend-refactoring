import { Order } from "../../../domain/entities";
import {OrderRepository} from "../../../domain/repositories";
import {Address, Id, OrderLine, PositiveNumber} from "../../../domain/valueObject";

export class InMemoryOrderRepository implements OrderRepository {
    private orders: Order[] = [];

    async findAll(): Promise<Order[]> {
        return this.orders;
    }

    async findById(id: Id): Promise<Order | undefined> {
        return this.orders.find(order => order.getId().equals(id));
    }

    async save(order: Order): Promise<void> {
        this.orders.push(order);
    }

    async delete(id: Id): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

describe('The OrderRepository', () => {
    it('saves a given valid order', async () => {
        // Arrange (Preparación: Configuras todo lo necesario para ejecutar la prueba)
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3)),
        ];
        const address = Address.create('123 Main St, Springfield, USA');
        const order = Order.create(items, address);
        const repository = new InMemoryOrderRepository();

        // Act (Ejecución: Realizas la acción que quieres probar)
        await repository.save(order);
        const savedOrder = await repository.findById(order.getId());

        // Assert (Verificación: Compruebas que el resultado es el esperado)
        expect(savedOrder?.toDTO()).toEqual(order.toDTO());
    })

    it('finds a previously saved orders', async () => {
        // Arrange
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3)),
        ];
        const address = Address.create('123 Main St, Springfield, USA');
        const order = Order.create(items, address);
        const repository = new InMemoryOrderRepository();
        await repository.save(order);

        // Act
        const orders = await repository.findAll();

        // Assert (Verificación: Compruebas que el resultado es el esperado)
        expect(orders.length).toBe(1);
        expect(orders[0].toDTO()).toEqual(order.toDTO());
    })
});