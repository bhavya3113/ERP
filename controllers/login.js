const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const faculty = require('../models/faculty');
const student = require('../models/student');

exports.login = (req ,res ,next)=>{
    try {
        const email = req.body.email;
        const pass = req.body.pass;
        const user = req.query.user;
        (user==="student")?student:faculty.findOne({email:email}).then(result=>{
            if(!result){
                return res.status(404).json('Not found');
            }
            console.log(result);
            bcrypt.compare(pass,result.password).then(item=>{
                if(item){
                    const accessToken = jwt.sign({email:email},process.env.AC,{expiresIn:"150s"});
                    const refreshToken = jwt.sign({email:email},process.env.RE , {expiresIn:"10s"});
                    res.statusCode = 201;
                    return res.json({
                        email,
                        accessToken,
                        refreshToken
                    });
                }
                res.statusCode = 401;
                res.json('incorrect pass');
            })
        });
    }
    catch{
        const err = new Error('not found');
        err.status= 404;
        throw err;
    }
}
