import mongoose from "mongoose"; 
const {Schema, model} = mongoose;

const orderlineSchema = new Schema(
    {
        quantity:{
            type:Number,
            required:true
        },
        price:{
            type: Number,
            required:true
        },
        plateId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Plate',
            required:true
        },
        orderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Order',
            required:true
        },
        plateName:{
            type: String
        },
        plateCategory:{
            type: String
        },
        plateImage:{
            type: String
        }
    }
);

export default model("Orderline", orderlineSchema);
