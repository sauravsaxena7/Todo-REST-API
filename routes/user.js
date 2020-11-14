const express =  require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const bcryptjs = require('bcryptjs');


const user_jwt = require('../middleware/user_jwt')

const jwt = require('jsonwebtoken');



router.get('/',user_jwt,async(req,res,next)=>{

    try{

        const user = await userModel.findById(req.user.id).select('-password');
        res.status(200).json({
            success:true,
            user:user
        });


    }catch(error){
        console.log(error.message);
        res.status(500).json({
            success:false,
            msg:"server error"
        });
        next();
    }

})


router.post('/register', async (req,res,next)=>{
    // res.json({

    //     msg:"working"
    // })

    
    const {username,email,password} = req.body;
    console.log(req.body.username);
    try{

        let user_exist = await userModel.findOne({email:email});
        if(user_exist){
           return res.status(400).json({
                success:false,
                msg:"user already exist"
            })
        }

        let user = new  userModel();
        user.username = username;
        user.email = email;
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        
        let size = 200;
        user.avatar = "https://gravatar.com/avatar/?s="+size+'&d=retro';

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        
        
        jwt.sign(payload, process.env.jwtUserSecret, {
            expiresIn: 360000
        }, (err, token) => {
            if(err) throw err;
            
            res.status(200).json({
                success: true,
                token: token
            });
        });




    }catch(err){

        console.log(err);
    }
   
});


router.post('/login', async (req,res,next)=>{

    const email = req.body.email;
    const password = req.body.password;

    try{
        let user = await userModel.findOne({email:email});
        if(!user){
            res.status(400).json({
                success:false,
                msg:'User not exists go and first register then continue'
            });
        }

        const isMatch = await bcryptjs.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({
                success:false,
                msg:'Password is incorrect'
            });
        }

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(payload,process.env.jwtUserSecret,
    
            {
                expiresIn:360000
                
            }, (error,token)=>{
                if(error) throw console.error();
                res.status(200).json({
                    success:true,
                    msg:"user logged in successfully",
                    token:token,
                    user:user
                });
            }

        )



    }catch(err){
        console.log(err.message);
        res.status(500).json({
            success:false,
            msg:"server error"
        })
    }
});


//Authorisation / Authentication

module.exports=router;