import mongoose from "mongoose"; 
const {Schema, model} = mongoose;

const orderSchema = new Schema(
    {
        price:{
            type: Number,
            required:true
        },
        address:{
            type: String,
            required:true
        },
        phoneNumber:{
            type: Number,
            required:true
        },
        date:{
            type: String,
            required:true
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        restaurantId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Restaurant',
            required:true
        },
        restaurantName:{
            type: String,
            required:true
        }
    }
);

export default model("Order", orderSchema);