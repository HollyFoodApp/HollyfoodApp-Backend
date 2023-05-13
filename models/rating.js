import mongoose from "mongoose"; 
const {Schema, model} = mongoose;

const ratingSchema = new Schema(
    {
        rating:{
            type: Number,
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
        }
    }
);

export default model("Rating", ratingSchema);