import express from 'express';
import {addOrderline, getByOrder} from '../controllers/orderline.js';
import { body } from "express-validator";

const router = express.Router();

router
    .route('/')
    .post(
        body("quantity").isNumeric(),
        body("price").isNumeric(),

        addOrderline
    )

router
    .route('/getByOrder/:orderId')
    .get(getByOrder)

export default router;