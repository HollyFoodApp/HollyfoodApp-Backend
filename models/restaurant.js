import mongoose from "mongoose"; 
const {Schema, model} = mongoose;

const restaurantSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:Number,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        image:{
            type: String
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    }
);

export default model("Restaurant", restaurantSchema);