import express from 'express';
import { addPlate, getAll, getByRestaurant, getById, deletePlate } from '../controllers/plate.js';
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";
import { verify } from 'jsonwebtoken';

const router = express.Router();

router
    .route('/')
    .post(
        multer,
        body("name").isLength({ min: 4 }),
        body("name").isLength({ max: 30}),

        body("category").isLength({ min: 4 }),
        body("category").isLength({ max: 30}),

        body("price").isNumeric(),

        addPlate
    )
    .delete(deletePlate)
    .get(getAll)

router
    .route('/:id')
    .get(getById)


router
    .route('/getByRestaurant/:restaurantId')
    .get(getByRestaurant)


export default router;