import Plate from '../models/plate.js';
import { validationResult } from 'express-validator';

export async function addPlate(req,res){
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({errors:validationResult(req).array()});
    } else {
        await Plate
        .create({
            name:req.body.name,
            category:req.body.category,
            price:req.body.price,
            image:`${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
            restaurantId:req.body.restaurantId,
            userId:req.body.userId,
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

export async function editPlate(req, res) {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
    } else {
      const plate = await Plate.findById(req.params.id);
      //const oldImageFilename = plate.image.split("/").pop();
  
      const updatedPlate = {
        name:req.body.name,
        category:req.body.category,
        price:req.body.price,
        //image:`${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
        restaurantId:req.body.restaurantId,
        userId:req.body.userId,
      };
  
      await Plate.findByIdAndUpdate(req.params.id, updatedPlate, {
        new: true,
      })
        .then((docs) => {
            res.status(200).json(docs);

            /*fs.unlink(`public/images/${oldImageFilename}`, (err) => {
            if (err) {
                console.error(err);
            }
            });*/
        })
        .catch((error) => {
            res.status(500).json({message:"Server error try again later."});
            console.log("Server Error: ", error)
        });
    }
}

export async function getAll(req,res){
    await Plate
    .find({})
    .then(docs=>{
      res.status(200).json(docs)
    })
    .catch(error=>{
      res.status(500).json({message:"Server error try again later."});
      console.log("Server Error: ", error)
    });
  }
  
export async function getByRestaurant(req,res){
    await Plate
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
    await Plate
    .findById(req.params.id)
    .then(docs=>{
        res.status(200).json(docs)
    })
    .catch(error=>{
        res.status(500).json({message:"Server error try again later."});
        console.log("Server Error: ", error)
    });
}
  
export async function deletePlate(req,res){
    await Plate
    .findByIdAndDelete(req.params.id)
    .then(docs=>{
        res.status(200).json(docs);
    })
    .catch(error=>{
        res.status(500).json({message:"Server error try again later."});
        console.log("Server Error: ", error)
    });
}
