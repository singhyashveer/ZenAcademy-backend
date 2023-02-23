require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const User=require('./models/userSchema');
const bcrypt=require('bcrypt');

const createAdmin=async(req,res)=>{
    const admin1={
        name:"User",
        userName:"user123",
        email:"u.user@zensar.com",
        password:"user123",
        userRoll:"admin"  
    }
    try{
        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        admin1.password = await bcrypt.hash(admin1.password, salt);
        const newAdmin=new User(admin1);
        newAdmin.save();
    }catch(err){
        console.log('err',err);
    }
}

const app=express();
const PORT=process.env.PORT || 5001;
const MONGO_URI=process.env.MONGO_URI;


mongoose.connect(MONGO_URI,{}).then(()=>{
    console.log('connected to DB');
    app.listen(PORT,()=>{
        console.log('listening...');
    })
    createAdmin();
})
