const express = require('express');
const dotenv = require('dotenv')
const app = express();
app.use(express.json());
dotenv.config();

const authRoutes = require('./routes/auth');

app.use(authRoutes);

// error handler
app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.send({
        error : {
            status: err.status || 500,
            message : err.message
        }
    })
})

app.listen(3000);