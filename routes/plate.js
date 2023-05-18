import express from 'express';
import { addPlate, editPlate, getAll, getByRestaurant, getById, deletePlate } from '../controllers/plate.js';
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";

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
    .get(getAll)

router
    .route('/:id')
    .put(
        multer,
        body("name").isLength({ min: 4 }),
        body("name").isLength({ max: 30}),

        body("category").isLength({ min: 4 }),
        body("category").isLength({ max: 30}),

        body("price").isNumeric(),

        editPlate
    )
    .get(getById)
    .delete(deletePlate)

router
    .route('/getByRestaurant/:restaurantId')
    .get(getByRestaurant)


export default router;