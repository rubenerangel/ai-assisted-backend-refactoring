import mongoose, { Document, Schema } from 'mongoose';
import {DiscountCode, OrderStatus} from "../../domain/models";

export interface MongooseOrder extends Document {
    _id: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    status: string;
    discountCode?: DiscountCode;
    shippingAddress: string;
    total?: number;
}

export const OrderSchema: Schema = new Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    items: [
        {
            productId: { type: String },
            quantity: { type: Number },
            price: { type: Number },
        },
    ],
    status: { type: String, default: OrderStatus.Created },
    discountCode: { type: String, required: false },
    shippingAddress: { type: String },
    total: { type: Number, default: 0 },
});

export const OrderModel= mongoose.model<MongooseOrder>('Order', OrderSchema);
