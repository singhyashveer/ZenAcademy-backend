require('dotenv').config()
const express = require("express");
const cors=require('cors');
const connectDB=require('./db/connect');
const mongoose=require('mongoose');

const app = express();
connectDB(process.env.MONGO_URI);

app.use(express.json());

app.use('/user',require('./routes/userRoutes'));

mongoose.connection.once('open',()=>{
    app.listen(process.env.PORT,console.log("Listening..."));
})

module.exports = app