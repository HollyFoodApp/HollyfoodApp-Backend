import express from 'express';
import {addRestaurant, updateRestaurant, deleteRestaurant, getAll, getByUser, getById} from '../controllers/restaurant.js';
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";

const router = express.Router();

router
    .route('/')
    .post(
        multer,
        body("name").isLength({ min: 4 }),
        body("name").isLength({ max: 30}),

        body("address").isLength({ min: 4 }),
        body("address").isLength({ max: 50}),

        body("phoneNumber").isNumeric(),
        body("phoneNumber").isLength({ min: 8 }),
        body("phoneNumber").isLength({ max: 8 }),

        body("description").isLength({ min: 4 }),
        body("description").isLength({ max: 30}),

        body("rating").isNumeric(),
        body("lat").isNumeric(),
        body("long").isNumeric(),

        addRestaurant
    )
    .get(getAll)

router
    .route('/:id')
    .put(
        multer,
        body("name").isLength({ min: 4 }),
        body("name").isLength({ max: 30}),

        body("address").isLength({ min: 4 }),
        body("address").isLength({ max: 30}),

        body("phoneNumber").isNumeric(),
        body("phoneNumber").isLength({ min: 8 }),
        body("phoneNumber").isLength({ max: 8 }),

        body("description").isLength({ min: 4 }),
        body("description").isLength({ max: 30}),

        updateRestaurant
    )
    .delete(deleteRestaurant)
    .get(getById)

router
    .route('/getByUser/:userId')
    .get(getByUser)


export default router;