const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        res.statusCode = 401
        return res.json('token required')
    }
    else{
        try{
            const token = authHeader.split(' ')[1];
            var decode = jwt.verify(token,process.env.AC);
        }
        catch(err){
            err.status=403;
            throw err;
        }
        if (!decode) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error; 
          }
        req.userId=decode.userId;
        req.emaill=decode.email;
        next();
    }
};