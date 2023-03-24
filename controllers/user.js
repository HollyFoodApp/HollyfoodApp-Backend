import User from '../models/user.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from "../middlewares/mailing.js";
import otpGenerator from "otp-generator";


export async function register(req,res){
    if (!validationResult(req).isEmpty()){
        res.status(400).json({errors:validationResult(req).array()});
    }
    else{

        let user = await User.findOne({email: req.body.email})

        if(user){
            res.status(409).json({error:"Email already exist"});
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
            .then(docs=>{
                sendEmail(req.body.email, "Verify Hollyfood Account", "This is your hollyfood account verification code: ", code);

                res.status(201).json(docs);
            })
            .catch(err=>{
                res.status(500).json({error:err});
            });
    
    
        }
    } 
}

export async function login(req,res){

    if(!validationResult(req).isEmpty()){
        res.status(400).json({errors:validationResult(req).array()});
    }
    else{

        let user = await User
        .findOne({email: req.body.email})
        .catch(err=>{
            res.status(500).json({error:err});
        });

        if(!user){
            res.status(404).json({
                error:"The email you entered is not connected to an account."
            });
        }
        else{
            const checkPassword = await bcrypt.compare(req.body.password, user.password);

            if(!checkPassword){
                res.status(401).json({
                    error:"The password you entered is incorrect."
                });
            }
            else{
                if(!user.verified){
                    res.status(434).json({
                        error:"Your account has not yet been verified."
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
    .then(docs=>{
        res.status(200).json(docs)
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
}

export async function getById(req,res){
    await User
    .findById(req.params.id)
    .then(docs=>{
        res.status(200).json(docs)
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
}

export async function updateOnce(req,res){
    if (!validationResult(req).isEmpty()){
        res.status(400).json({errors:validationResult(req).array()});
    }
    else {
        let user = await User.findById(req.params.id)
        let user2 = await User.findOne({email: req.body.email})
    
        if(user2){
            if(user.email == user2.email){
                await User
                .findByIdAndUpdate(req.params.id, req.body, {new:true})
                .then(docs=>{
                    res.status(200).json(docs);
                })
                .catch(err=>{
                    res.status(500).json({error:err});
                });
            }
            else{
                res.status(409).json({error:"Email already exist"});
            }
        }
        else{
            await User
            .findByIdAndUpdate(req.params.id, req.body)
            .then(docs=>{
                res.status(200).json(docs);
            })
            .catch(err=>{
                res.status(500).json({error:err});
            });
        }
    } 
}

export async function deleteOnce(req,res){
    await User
    .findByIdAndDelete(req.params.id)
    .then(docs=>{
        res.status(200).json(docs);
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
}

export async function forgotPassword(req,res){
    var user = await User
    .findOne({resetPasswordCode:req.body.code})
    .catch(err=>{
        res.status(500).json({error:err});
    });

    if(!user) {
        res.status(404).json({
            error:"The email you entered is not connected to an account."
        });
    }
    else {
        var code = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        user.resetPasswordCode = code;
        user.save();

        await sendEmail(user.email, "Reset password code", "This is your reset password code: ", user.resetPasswordCode);
        res.status(200).send({
            message:"Reset password code sent successfully."
        })
    }  
}

  