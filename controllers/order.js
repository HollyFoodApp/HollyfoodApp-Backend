import Order from '../models/order.js';
import Orderline from '../models/orderline.js';
import { validationResult } from 'express-validator';

export async function addOrder(req,res){
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({errors:validationResult(req).array()});
    } else {
        await Order
        .create({
            price:req.body.price,
            address:req.body.address,
            phoneNumber:req.body.phoneNumber,
            date:req.body.date,
            userId:req.body.userId,
            restaurantId:req.body.restaurantId,
            restaurantName:req.body.restaurantName
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
  
export async function getAll(req,res){
  await Order
  .find({})
  .then(docs=>{
    res.status(200).json(docs)
  })
  .catch(error=>{
    res.status(500).json({message:"Server error try again later."});
    console.log("Server Error: ", error)
  });
}

export async function getByUser(req,res){
  await Order
  .find({userId: req.params.userId})
  .then(docs=>{
    res.status(200).json(docs)
  })
  .catch(error=>{
    res.status(500).json({message:"Server error try again later."});
    console.log("Server Error: ", error)
  });
}

export async function getByRestaurant(req,res){
    await Order
    .find({restaurantId: req.params.restaurantId})
    .then(docs=>{
      res.status(200).json(docs)
    })
    .catch(error=>{
      res.status(500).json({message:"Server error try again later."});
      console.log("Server Error: ", error)
    });
}
  
export async function getById(req,res){
  await Order
  .findById(req.params.id)
  .then(docs=>{
    res.status(200).json(docs)
  })
  .catch(error=>{
    res.status(500).json({message:"Server error try again later."});
    console.log("Server Error: ", error)
  });
}

export async function deleteOrder(req,res){
    await Order
    .findByIdAndDelete(req.params.id)
    .then(docs=>{
      res.status(200).json(docs);
    })
    .catch(error=>{
      res.status(500).json({message:"Server error try again later."});
      console.log("Server Error: ", error)
    });
  }
  
