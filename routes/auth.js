const express =require('express');
const auth = require('../middleware/isAuth');
const jwt = require('jsonwebtoken');
const router = express.Router();

const loginController = require('../controllers/login');
const req = require('express/lib/request');

router.get('/renewToken',(req,res,next)=>{
    const refreshToken = req.get('Authorization');
    if(!refreshToken.split(' ')[1]){
        return res.status(403).json({message:"User not authenticated"})
    }
    jwt.verify(refreshToken.split(' ')[1] ,process.env.RE,(err,user)=>{
        if(!err){
            console.log(user);
            const accessToken = jwt.sign({email:user},process.env.AC,{expiresIn:"150s"});
            return res.status(201).json(accessToken);
        }
        else{
            err.status = 403;
            throw err;
        }
    });
})

router.post("/login",loginController.login);



module.exports = router;