import User from '../models/user.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from "../middlewares/mailing.js";
import otpGenerator from "otp-generator";


export async function register(req,res){
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({errors:validationResult(req).array()});
    }
    else {

        let user = await User
        .findOne({email: req.body.email})
        .catch(error=>{
            res.status(500).json({
                message:"Server error try again later."
            });
            console.log("Server Error: ", error)
        });
    
        if (user) {
            res.status(409).json({message:"Email already exist."});
        }
        else {

            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            var code = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

            await User
            .create({
                fullname: req.body.fullname,
                email: req.body.email,
                password: hashedPassword,
                phone: req.body.phone,
                role: req.body.role,
                //image: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
                verificationCode: code,
                verified: req.body.verified,
            })
            .then(user=>{
                sendEmail(req.body.email, "Verify Hollyfood Account", "This is your hollyfood account verification code: ", code);

                res.status(201).json(user);
            })
            .catch(error=>{
                res.status(500).json({message:"Server error try again later."});
                console.log("Server Error: ", error)
            });
        }
    } 
}

export async function login(req,res){

    if (!validationResult(req).isEmpty()) {
        res.status(400).json({errors:validationResult(req).array()});
    }
    else {
        let user = await User
        .findOne({email: req.body.email})
        .catch(error=>{
            res.status(500).json({message:"Server error try again later."});
            console.log("Server Error: ", error)
        });

        if (!user) {
            res.status(404).json({
                message:"The email you entered is not connected to an account."
            });
        }
        else {
            const checkPassword = await bcrypt.compare(req.body.password, user.password);

            if(!checkPassword){
                res.status(401).json({
                    message:"The password you entered is incorrect."
                });
            }
            else{
                if(!user.verified){
                    res.status(434).json({
                        message:"Your account has not yet been verified."
                    });
                }    
                else{
                    const token = jwt.sign({_id:user._id}, 'privateKey')
                    res.header('x-auth-token', token).status(200).send(user);
                }
            }
        }        
    }
}

export async function getAll(req,res){
    await User
    .find({})
    .then(user=>{
        res.status(200).json(user)
    })
    .catch(error=>{
        res.status(500).json({message:"Server error try again later."});
        console.log("Server Error: ", error)
    });
}

export async function getById(req,res){
    await User
    .findById(req.params.id)
    .then(user=>{
        res.status(200).json(user)
    })
    .catch(error=>{
        res.status(500).json({message:"Server error try again later."});
        console.log("Server Error: ", error)
    });
}

export async function getByEmail(req,res){
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({errors:validationResult(req).array()});
    }
    else {
        await User
        .findOne({email: req.body.email})
        .then(user=>{
            res.status(200).json(user)
        })
        .catch(error=>{
            res.status(500).json({message:"Server error try again later."});
            console.log("Server Error: ", error)
        });    
    }
}

export async function updateOnce(req,res){
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({errors:validationResult(req).array()});
    }
    else {
        let user = await User.findById(req.params.id)
        let user2 = await User.findOne({email: req.body.email})
    
        if (user2) {
            if(user.email == user2.email){
                await User
                .findByIdAndUpdate(req.params.id, req.body, {new:true})
                .then(user=>{
                    res.status(200).json(user);
                })
                .catch(error=>{
                    res.status(500).json({message:"Server error try again later."});
                    console.log("Server Error: ", error)
                });    
            }
            else{
                res.status(409).json({message:"Email already exist"});
            }
        }
        else {
            await User
            .findByIdAndUpdate(req.params.id, req.body)
            .then(user=>{
                res.status(200).json(user);
            })
            .catch(error=>{
                res.status(500).json({message:"Server error try again later."});
                console.log("Server Error: ", error)
            });
        }
    } 
}

export async function deleteOnce(req,res){
    await User
    .findByIdAndDelete(req.params.id)
    .then(user=>{
        res.status(200).json(user);
    })
    .catch(error=>{
        res.status(500).json({message:"Server error try again later."});
        console.log("Server Error: ", error)
    });
}

export async function forgotPassword(req,res){

    if (!validationResult(req).isEmpty()) {
        res.status(400).json({errors:validationResult(req).array()});
    }
    else {
        var user = await User
        .findOne({email:req.body.email})
        .catch(error=>{
            res.status(500).json({message:"Server error try again later."});
            console.log("Server Error: ", error)
        });

        if (!user) {
            res.status(404).json({
                message:"The email you entered is not connected to an account."
            });
        }
        else {
            var code = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
            user.resetPasswordCode = code;
            user.save();
    
            await sendEmail(user.email, "Reset password code", "This is your reset password code: ", user.resetPasswordCode);
            res.status(200).json({
                message:"Reset password code sent successfully."
            })
        }      
    }
}

export async function codeVerification(req,res){

    await User
    .findOne({resetPasswordCode:req.body.code})
    .then(user=>{
        if (user) {
            res.status(200).send({
                message:'Valid code.'
            })
        }
        else {
            res.status(404).json({
                message:"The code you entered doesn't match your code. Please try again."
            })
        }
    })
    .catch(error=>{
        res.status(500).json({
            message:"Server error try again later."
        });
        console.log("Server Error: ", error)
    });
}

export async function resetPassword(req,res){

    if (!validationResult(req).isEmpty()) {
        res.status(400).json({errors:validationResult(req).array()});
    }
    else {
        var user = await User.findOne({email:req.body.email})
        .catch(error=>{
            res.status(500).json({
                message:"Server error try again later."
            });
    
            console.log("Server Error: ", error)
        });
    
        if (!user) {
            res.status(404).json({
                message:'The email you entered is not connected to an account.'
            })
        }
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            user.password = hashedPassword;
            user.save();
    
            res.status(200).send({
                message:"Password reset successfully."
            })
        }    
    }
}

export async function verifyAccount(req,res){

    await User
    .findOne({email:req.body.email})
    .then(user=>{
        if(user){
            if(user.verificationCode == req.body.code)
            {
                user.verified = true;
                user.save();
                res.status(200).send({
                    message:"User verified successfully."
                })    
            }
            else
            {
                res.status(404).json({
                    message:"The code you entered doesn't match your code. Please try again."
                })    
            }
        }
        else
        {
            res.status(404).json({
                message:'User not found.'
            })
        }
    })
    .catch(error=>{
        res.status(500).json({
            message:"Server error try again later."
        });

        console.log("Server Error: ", error)
    });
}


export async function changePassword(req,res){

    var user = await User
    .findOne({email:req.body.email})
    .catch(error=>{
        res.status(500).json({
            message:"Server error try again later."
        });

        console.log("Server Error: ", error)
    });

    if(user) {
        const checkPassword = await bcrypt.compare(req.body.oldPassword, user.password);
        if(checkPassword) {
            const newPassword = await bcrypt.hash(req.body.newPassword, 10)
            user.password = newPassword;
            user.save();
    
            res.status(200).send({
                message:"Password changed successfully."
            })    
        }
        else {
            return res.status(401).send({
                message:"Wrong password."
            })
        }
    }
    else {
        res.status(404).send({
            message:'User not found.'
        })
    }
}