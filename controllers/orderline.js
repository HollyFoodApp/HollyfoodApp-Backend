import Orderline from '../models/orderline.js';
import { validationResult } from 'express-validator';

export async function addOrderline(req,res){
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({errors:validationResult(req).array()});
    } else {
        await Orderline
        .create({
            quantity:req.body.quantity,
            price:req.body.price,
            plateId:req.body.plateId,
            orderId:req.body.orderId,
            plateName:req.body.plateName,
            plateCategory:req.body.plateCategory,
            plateImage:req.body.plateImage
        })
        .then(docs=>{
          res.status(201).json(docs);
        })
        .catch(error=>{
          res.status(500).json({message:"Server error try again later."});
          console.log("Server Error: ", error)
        });
    } 
}
  
export async function getByOrder(req,res){
  await Order
  .find({orderId: req.params.orderId})
  .then(docs=>{
    res.status(200).json(docs)
  })
  .catch(error=>{
    res.status(500).json({message:"Server error try again later."});
    console.log("Server Error: ", error)
  });
}
