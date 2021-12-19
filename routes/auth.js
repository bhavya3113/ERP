const express =require('express');
const auth = require('../middleware/isAuth');
const jwt = require('jsonwebtoken');
const router = express.Router();

const loginController = require('../controllers/login');
const req = require('express/lib/request');

router.post('/renewToken',(req,res,next)=>{
    const refreshToken = req.body.token;
    if(!refreshToken){
        return res.status(403).json({message:"User not authorized"})
    }
    jwt.verify(refreshToken ,process.env.RE,(err,user)=>{
        if(!err){
            const accessToken = jwt.sign({email:user},process.env.AC,{expiresIn:"150s"});
            return res.status(201).json(accessToken);
        }
        else{
            err.message = "user not authenticated";
            err.status = 403;
            throw err;
        }
    });
})

router.post("/login",loginController.login);



module.exports = router;