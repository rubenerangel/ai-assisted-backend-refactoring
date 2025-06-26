import {Order} from "./entities";
import {Id} from "./valueObject";

export interface OrderRepository {
    findAll(): Promise<Order[]>;
    findById(id: Id): Promise<Order | undefined>;
    save(order: Order): Promise<void>;
    delete(id: Id): Promise<void>;
}