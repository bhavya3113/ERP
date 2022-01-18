const express = require('express');

const dotenv = require('dotenv')
const app = express();
app.use(express.json());
dotenv.config();
app.use('/image',express.static(__dirname+'/image'));
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const facultyRoutes = require("./routes/faculty");
const mongoose = require("mongoose");


app.use(express.urlencoded({extended:false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});



app.use('/auth',authRoutes);
app.use('/admin',adminRoutes);
app.use('/faculty',facultyRoutes);
// error handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message||"error not define";
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


mongoose.connect(process.env.CONNECT_TO_DB)
.then(result => {
    app.listen(process.env.PORT);
    console.log("connected");
})
.catch(err => console.log("error",err));
