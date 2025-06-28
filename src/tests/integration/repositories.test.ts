import {Address, Id, OrderLine, PositiveNumber} from "../../domain/valueObject";
import {Order} from "../../domain/entities";
import mongoose from "mongoose";
import {OrderMongoRepository} from "../../infrastructure/repositories/orderMongoRepository";

async function createValidOrder(repository: OrderMongoRepository) {
    const items = [
        new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3)),
    ];
    const address = Address.create('123 Main St, Springfield, USA');
    const order = Order.create(items, address);
    await repository.save(order);
    return order;
}

describe('The order Mongo Repository', () => {
    let repository: OrderMongoRepository;

    beforeAll(async () => {
        const dbUrl = 'mongodb://127.0.0.1:27017/db_orders_mongo_repository';
        repository = await OrderMongoRepository.create(dbUrl);
        await mongoose.connection.dropDatabase();
    })

    afterEach(async () => {
        // Clean up the database after each test
        await mongoose.connection.dropDatabase();
    })

    it('saves and retrieve a given new valid order', async () => {
        // expect(true).toBe(true);
        // Arrange (Preparación: Configuras todo lo necesario para ejecutar la prueba)
        // const items = [
        //     new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3 )),
        // ]
        // const address = Address.create('123 Main St, Springfield, USA');
        // const order = Order.create(items, address);
        //
        // // Act (Ejecución: Realizas la acción que quieres probar)
        // await repository.save(order);
        const order = await createValidOrder(repository);

        // Assert (Verificación: Compruebas que el resultado es el esperado)
        const savedOrder = await repository.findById(order.getId());
        expect(savedOrder?.toDTO().shippingAddress).toEqual(order.toDTO().shippingAddress);
        expect(savedOrder?.toDTO()).toEqual(order.toDTO());
    })

    it('finds all previously saved orders', async () => {
        // Arrange
        // const items1 = [
        //     new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3 )),
        // ];
        // const address1 = Address.create('123 Main St, Springfield, USA');
        // const order1 = Order.create(items1, address1);
        // await repository.save(order1);
        const order = await createValidOrder(repository);

        const items2 = [
            new OrderLine(Id.create(), PositiveNumber.create(1), PositiveNumber.create(5 )),
        ];
        const address2 = Address.create('456 Elm St, Springfield, USA');
        const order2 = Order.create(items2, address2);
        await repository.save(order2);

        // Act
        const orders = await repository.findAll();

        // Assert
        expect(orders.length).toBe(2);
        expect(orders[0].toDTO()).toEqual(order.toDTO());
        expect(orders[1].toDTO()).toEqual(order2.toDTO());
    })

    it('deletes a previously saved order', async () => {
        // Arrange
        // const items = [
        //     new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3 )),
        // ];
        // const address = Address.create('123 Main St, Springfield, USA');
        // const order = Order.create(items, address);
        // await repository.save(order);
        const order = await createValidOrder(repository);

        // Act
        await repository.delete(order.getId());

        //Assert
        const orders = await repository.findAll();
        expect(orders.length).toBe(0);
    })

    it('updates a previously saved order', async () => {
        // Arrange
        const order = await createValidOrder(repository);

        // Act
        order.updateShippingAddress(Address.create('789 Oak St, Springfield, USA'));
        await repository.save(order);

        // Assert
        const updatedOrder = await repository.findById(order.getId());
        expect(updatedOrder?.toDTO().shippingAddress).toEqual(order.toDTO().shippingAddress);
        expect(updatedOrder?.toDTO()).toEqual(order.toDTO());
    })
})