import Restaurant from '../models/restaurant.js';
import Rating from '../models/rating.js';
import { validationResult } from 'express-validator';

export async function addRestaurant(req,res){
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({errors:validationResult(req).array()});
    } else {
        await Restaurant
        .create({
          name:req.body.name,
          address:req.body.address,
          phoneNumber:req.body.phoneNumber,
          description:req.body.description,
          image:`${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
          rating:0,
          lat:req.body.lat,
          long:req.body.long,
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

export async function updateRestaurant(req, res) {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
    } else {
      const restaurant = await Restaurant.findById(req.params.id);
      //const oldImageFilename = restaurant.image.split("/").pop();
  
      const updatedRestaurant = {
        name: req.body.name,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        description: req.body.description,
        //image:`${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
        userId: req.body.userId,
      };
  
      await Restaurant.findByIdAndUpdate(req.params.id, updatedRestaurant, {
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
        .catch((err) => {
          res.status(500).json({message:"Server error try again later."});
          console.log("Server Error: ", error)
        });
    }
}
  
export async function deleteRestaurant(req,res){
  await Restaurant
  .findByIdAndDelete(req.params.id)
  .then(docs=>{
    res.status(200).json(docs);
  })
  .catch(error=>{
    res.status(500).json({message:"Server error try again later."});
    console.log("Server Error: ", error)
  });
}

export async function getAll(req,res){
  await Restaurant
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
  await Restaurant
  .find({userId: req.params.userId})
  .then(docs=>{
    res.status(200).json(docs)
  })
  .catch(error=>{
    res.status(500).json({message:"Server error try again later."});
    console.log("Server Error: ", error)
  });
}

export async function getById(req,res){
  await Restaurant
  .findById(req.params.id)
  .then(docs=>{
    res.status(200).json(docs)
  })
  .catch(error=>{
    res.status(500).json({message:"Server error try again later."});
    console.log("Server Error: ", error)
  });
}

export async function calculateAverageRating(req, res) {
  const restaurant =  await Restaurant
  .findById(req.params.restaurantId)
  .catch(error=>{
    res.status(500).json({message:"Server error try again later."});
    console.log("Server Error: ", error)
  });

  const ratings = await Rating
  .find({ restaurantId: req.params.restaurantId })
  .catch(error=>{
    res.status(500).json({message:"Server error try again later."});
    console.log("Server Error: ", error)
  });

  const count = ratings.length;
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += ratings[i].rating;
  }
  const average = count > 0 ? total / count : 0;
  restaurant.rating = average
  await restaurant.save()
  .then(user=>{
    res.status(200).json(restaurant)
  })
  .catch(error=>{
    res.status(500).json({message:"Server error try again later."});
    console.log("Server Error: ", error)
  });
}



