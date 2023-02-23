require('dotenv').config()
const express = require("express");
const cors=require('cors');
const cookieParser=require('cookie-parser');
const connectDB=require('./db/connect');
const mongoose=require('mongoose');

const app = express();
connectDB(process.env.MONGO_URI);

app.use(cors({origin:'http://localhost:3000',credentials:true}));

app.use(express.json());
app.use(cookieParser());

app.use('/user',require('./routes/userRoutes'));

mongoose.connection.once('open',()=>{
    app.listen(process.env.PORT,console.log("Listening..."));
})

module.exports = app