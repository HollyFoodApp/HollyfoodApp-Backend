import mongoose from "mongoose"; 
const {Schema, model} = mongoose;

const userSchema = new Schema(
    {
        fullname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true
        },
        role:{
            type:String,
            required:true
        },
        image:{
            type: String
        },
        verificationCode :{
            type: String,
            required:true
        },
        verified:{
            type: Boolean,
            default: false,
            required:true
        }, 
        resetPasswordCode:{
          type: String
        }
    }
);

export default model("User", userSchema);