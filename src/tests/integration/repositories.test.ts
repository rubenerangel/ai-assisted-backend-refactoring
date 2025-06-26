import {Address, Id, OrderLine, PositiveNumber} from "../../domain/valueObject";
import {Order} from "../../domain/entities";
import mongoose from "mongoose";
import {OrderMongoRepository} from "../../infrastructure/repositories/orderMongoRepository";

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
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3 )),
        ]
        const address = Address.create('123 Main St, Springfield, USA');
        const order = Order.create(items, address);

        // Act (Ejecución: Realizas la acción que quieres probar)
        await repository.save(order);

        // Assert (Verificación: Compruebas que el resultado es el esperado)
        const savedOrder = await repository.findById(order.id);
        expect(savedOrder?.shippingAddress).toEqual(order.shippingAddress);
        expect(savedOrder?.toDTO()).toEqual(order.toDTO());
    })
})