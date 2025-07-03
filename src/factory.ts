// import dotenv from "dotenv";
import {OrderRepository} from "./domain/repositories";
import {OrderMongoRepository} from "./infrastructure/repositories/orderMongoRepository";
import {OrderUseCase} from "./application/orderUseCase";

// dotenv.config({
//     path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
// });

// export const PORT: number = Number(process.env.PORT) || 3002;
// const DB_URL: string = process.env.DB_URL || 'mongodb://127.0.0.1:27017/db_orders'

export class Factory {
    private static OrderRepository: OrderRepository;

    static async getOrderRepository() {
        if(!this.OrderRepository) {
            const DB_URL = process.env.DB_URL as string
            this.OrderRepository = await OrderMongoRepository.create(DB_URL)
            // throw new Error('OrderRepository not initialized. Call createOrderRepository first.');
        }

        return this.OrderRepository;
    }

    static async createOrderUseCase() {
        const repo = await this.getOrderRepository();
        return new OrderUseCase(repo);
    }
}
