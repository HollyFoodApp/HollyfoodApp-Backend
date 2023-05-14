import mongoose from "mongoose"; 
const {Schema, model} = mongoose;

const plateSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        restaurantId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Restaurant",
            required:true
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    }
);

export default model("Plate", plateSchema);