import express from 'express';
import { register, login, getAll, getById, updateUser, deleteUser, forgotPassword, codeVerification, resetPassword, verifyAccount, getByEmail, changePassword} from '../controllers/user.js';
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";
import { verify } from 'jsonwebtoken';

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
    .delete(deleteUser)
    .get(getAll)

router
    .route('/:id')
    .get(getById)
    .patch(
        multer,
        body("fullname").isLength({ min: 6 }),
        body("fullname").isLength({ max: 30}),

        body("email").isEmail(),

        body("phone").isNumeric(),
        body("phone").isLength({ min: 8 }),
        body("phone").isLength({ max: 8 }),

        updateUser
    )


router
    .route('/getByEmail')
    .post(
        body("email").isEmail(),
        
        getByEmail
    )

router
    .route('/login')
    .post(
        body("email").isEmail(),

        body("password").isLength({ min: 6 }),
        body("password").isLength({ max: 30}),

        login
    )

router
    .route('/forgotPassword')
    .post(
        body("email").isEmail(),
        
        forgotPassword
    )

router
    .route('/codeVerification')
    .post(codeVerification)

router
    .route('/resetPassword')
    .post(
        body("email").isEmail(),
        
        body("password").isLength({ min: 6 }),
        body("password").isLength({ max: 30}),

        resetPassword
    )

router
    .route('/verifyAccount')
    .post(
        body("email").isEmail(),
        
        verifyAccount
    )

router
    .route('/changePassword')
    .post(
        body("email").isEmail(),
        
        changePassword
    )


export default router;