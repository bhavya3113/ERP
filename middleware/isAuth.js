const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(420).json('token required')
    }
    else{
        try{
            const token = authHeader.split(' ')[1];
            var decode = jwt.verify(token,process.env.AC);
        }
        catch(err){
            err.statusCode=450;
            throw err;
        }
        if (!decode) {
            const error = new Error('Not authenticated.');
            error.statusCode = 420;
            throw error; 
          }
        req.userId=decode.userId;
        req.emaill=decode.email;
        next();
    }
};