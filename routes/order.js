import express from 'express';
import {addOrder, getAll, getByUser, getByRestaurant, getById, deleteOrder} from '../controllers/order.js';
import { body } from "express-validator";

const router = express.Router();

router
    .route('/')
    .post(
        body("price").isNumeric(),

        body("address").isLength({ min: 4 }),
        body("address").isLength({ max: 30}),

        body("phoneNumber").isNumeric(),

        addOrder
    )
    .get(getAll)

router
    .route('/:id')
    .delete(deleteOrder)
    .get(getById)

router
    .route('/getByUser/:userId')
    .get(getByUser)

router
    .route('/getByRestaurant/:restaurantId')
    .get(getByRestaurant)

export default router;