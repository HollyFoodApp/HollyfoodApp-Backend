import User from '../models/user.js';
import { validationResult } from 'express-validator';

export async function register(req,res){
    if (!validationResult(req).isEmpty()){
        res.status(400).json({errors:validationResult(req).array()});
    }
    else{

        let user = await User.findOne({email: req.body.email})

        if(user){
            return res.send('Email Already Exists')
        }
        else {

            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            var code = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

            await User
            .create({
                fullname: req.body.fullname,
                email: req.body.email,
                password: req.body.hashedPassword,
                phone: req.body.phone,
                role: req.body.role,
                image: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
                verificationCode: code
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

        let user = await User.findOne({email: req.body.email})

        if(!user){
            return res.send({
                message:"Invalid Email Or Password"
            })
        }
        else{

            if(!user.verified){
                return res.send({
                    message:"Account Not Verified Yet"
                })
            }
            else{
                const checkPassword = await bcrypt.compare(req.body.password, user.password);

                if(!checkPassword){
                    return res.send({
                        message:"Invalid Email Or Password"
                    })
                }
                else{
                    const token = jwt.sign({_id:user._id}, 'privateKey')
                    return res.header('x-auth-token', token).status(200).send(user);
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
                return res.send({
                    message:"Email Already Exist",
                })
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
  