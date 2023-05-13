import Rating from '../models/rating.js';
import Restaurant from '../models/restaurant.js';
import {calculateAverageRating} from '../controllers/restaurant.js';

import { validationResult } from 'express-validator';

export async function addOrUpdateRating(req, res) {

    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: validationResult(req).array() });
    } else {
        const existingRating = await Rating.findOne({
            userId: req.body.userId,
            restaurantId: req.params.restaurantId,
        });

        if (existingRating) {
            existingRating.rating = req.body.rating;
            await existingRating.save()
            .catch(error => {
                res.status(500).json({ message: "Server error try again later." });
                console.log("Server Error: ", error);
            });

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
            .then(docs=>{
              res.status(200).json(existingRating)
            })
            .catch(error=>{
              res.status(500).json({message:"Server error try again later."});
              console.log("Server Error: ", error)
            });
                    
        } else {
            const newRating = await Rating.create({
                rating: req.body.rating,
                userId: req.body.userId,
                restaurantId: req.params.restaurantId,
            })
            .catch(error => {
                res.status(500).json({ message: "Server error try again later." });
                console.log("Server Error: ", error);
            });

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
            .then(docs=>{
              res.status(201).json(newRating)
            })
            .catch(error=>{
              res.status(500).json({message:"Server error try again later."});
              console.log("Server Error: ", error)
            });

        }      
    } 
}
  
