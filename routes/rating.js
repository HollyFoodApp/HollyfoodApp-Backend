import express from 'express';
import {addOrUpdateRating} from '../controllers/rating.js';
import { body } from "express-validator";

const router = express.Router();

router
    .route('/')
    .post(
        body("rating").isNumeric(),
        addOrUpdateRating
    )

export default router;