import mongoose from "mongoose"; 
const {Schema, model} = mongoose;

const orderSchema = new Schema(
    {
        price:{
            type: Number,
            required
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required
        },
        restaurantId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Restaurant',
            required
        }
    }
);

export default model("Order", orderSchema);