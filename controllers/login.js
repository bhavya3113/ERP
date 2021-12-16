const jwt = require('jsonwebtoken');

exports.login = (req ,res ,next)=>{
    try {
        const email = req.body.email;
        const pass = req.body.pass;
        const user = req.query.user;
        user.find();
        console.log(user);
        const accessToken = jwt.sign({email:email},process.env.AC,{expiresIn:"50s"});
        const refreshToken = jwt.sign({email:email},process.env.RE , {expiresIn:"1d"});
        res.statusCode = 201;
        return res.json({
            accessToken,
            refreshToken
        });
    }
    catch{
        const err = new Error('not found');
        throw err;
    }
}