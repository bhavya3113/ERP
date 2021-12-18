const express = require('express');

const dotenv = require('dotenv')
const app = express();
app.use(express.json());
dotenv.config();

const authRoutes = require('./routes/auth');

const mongoose = require("mongoose");


app.use(express.urlencoded({extended:true}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});



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


mongoose
  .connect(
    process.env.CONNECT_TO_DB
  )
  .then(result => {
    app.listen(process.env.PORT);
    console.log("connected");
  })
  .catch(err => console.log("error",err));
