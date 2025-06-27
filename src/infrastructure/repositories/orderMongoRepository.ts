import {OrderRepository} from "../../domain/repositories";
import {Order} from "../../domain/entities";
import {Id} from "../../domain/valueObject";
import {MongooseOrder, OrderSchema} from "./orderModel";
import {OrderStatus} from "../../domain/models";
import mongoose, { Model } from "mongoose";
import {Mongoose} from "mongoose";

export class OrderMongoRepository implements OrderRepository {
    constructor(private mongoClient: Mongoose) {}

    static async create(dbUrl: string) {
        const client = await mongoose.connect(dbUrl)
        return new OrderMongoRepository(client);
    }

    async findAll(): Promise<Order[]> {
        const MongooseOrderModel = this.mongooseModel();
        const mongoOrder = await MongooseOrderModel.find()

        return mongoOrder.map(this.toOrderEntity);
    }

    private toOrderEntity = (order: MongooseOrder) =>
        Order.fromDTO({
            id: order._id,
            items: order.items,
            discountCode: order.discountCode,
            shippingAddress: order.shippingAddress,
            status: order.status as OrderStatus,
        });

    async findById(id: Id): Promise<Order | undefined> {
        const MongooseOrderModel = this.mongooseModel();
        const mongoOrder = await MongooseOrderModel.findById(id.value);
        if (!mongoOrder) {
            return undefined;
        }

        return Order.fromDTO({
            id: mongoOrder._id,
            items: mongoOrder.items,
            discountCode: mongoOrder.discountCode,
            shippingAddress: mongoOrder.shippingAddress,
            status: mongoOrder.status as OrderStatus,
        })
    }

    async save(order: Order): Promise<void> {
        const dto = order.toDTO();
        const MongooseOrderModel = this.mongooseModel();
        const mongoOrder = new MongooseOrderModel({
            _id: dto.id,
            items: dto.items,
            discountCode: dto.discountCode,
            shippingAddress: dto.shippingAddress,
            status: dto.status,
        })
        await mongoOrder.save();
    }

    private mongooseModel() {
        const modelName = 'Order';
        if (this.mongoClient.models[modelName]) {
            return this.mongoClient.models[modelName] as Model<MongooseOrder>;
        }
        return this.mongoClient.model<MongooseOrder>('Order', OrderSchema);
    }
    delete(id: Id): Promise<void> {
        throw new Error("Method not implemented.");
    }
}