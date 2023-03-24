import express from 'express';
import { register, login, getAll, getById, updateOnce, deleteOnce } from '../controllers/user.js';
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";

const router = express.Router();

router
    .route('/')
    .post(
        multer,
        body("fullname").isLength({ min: 6 }),
        body("fullname").isLength({ max: 30}),

        body("email").isEmail(),

        body("password").isLength({ min: 6 }),
        body("password").isLength({ max: 30}),

        body("phone").isNumeric(),
        body("phone").isLength({ min: 8 }),
        body("phone").isLength({ max: 8 }),

        register
    )
    .patch(
        body("fullname").isLength({ min: 6 }),
        body("fullname").isLength({ max: 30}),

        body("email").isEmail(),

        body("password").isLength({ min: 6 }),
        body("password").isLength({ max: 30}),

        body("phone").isNumeric(),
        body("phone").isLength({ min: 8 }),
        body("phone").isLength({ max: 8 }),

        updateOnce
    )
    .delete(deleteOnce)
    .get(getAll)

router
    .route('/:id')
    .get(getById)

router
    .route('/login')
    .post(login)

export default router;