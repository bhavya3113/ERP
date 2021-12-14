const express = require('express');
const app = express();
app.use(express.json());
const authRoutes = require('./routes/auth');

app.use(authRoutes);


app.listen(3000);