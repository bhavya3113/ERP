const jwt = require('jsonwebtoken');

exports.login = (req ,res ,next)=>{
    const email = req.body.email;
    const pass = req.body.pass;
    const user = req.query.user;
    
    const accessToken = jwt.sign({email:email},"access",{expiresIn:"50s"});
    const refreshToken = jwt.sign({email:email},"refresh" , {expiresIn:"1d"});
    res.statusCode = 201;
    return res.json({
        accessToken,
        refreshToken
    });
}