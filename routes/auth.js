const express =require('express');
const {body}= require("express-validator");
const auth = require('../middleware/isAuth');
const jwt = require('jsonwebtoken');
const router = express.Router();

const loginController = require('../controllers/login');


router.get('/renewToken',(req,res,next)=>{
    const refreshToken = req.get('Authorization');
    if(!refreshToken.split(' ')[1]){
        return res.status(403).json({message:"User not authenticated"})
    }
    jwt.verify(refreshToken.split(' ')[1] ,process.env.RE,(err,user)=>{
        if(!err){
            //console.log(user);
            const accessToken = jwt.sign({email:user.email,userId:user.userId},process.env.AC,{expiresIn:"150s"});
            return res.status(201).json(accessToken);
        }
        else{
            err.status = 403;
            throw err;
        }
    });
})

router.post("/login",[
    body("email").normalizeEmail()
    ],loginController.login);

router.post("/resendotp",[
    body("email").normalizeEmail()
    ],loginController.resendotp);
      
router.post("/verifybeforereset",[
    body("email").normalizeEmail()
    ],loginController.verifybeforereset);
      
router.post("/checkotpbeforereset",[
    body("email").normalizeEmail()
    ],loginController.checkotpbeforereset);
      
router.post("/resetpassword",[
    body("email").normalizeEmail(),
    body("password").trim().isLength({ min: 8 })
    ],loginController.resetPassword);

module.exports = router;