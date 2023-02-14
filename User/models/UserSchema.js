const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required']
    },
    userName:{
        type:String,
        required:[true,'userName is required']
    },
    email:{
        type:String,
        required:[true,'eMail is required']
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    userRoll:{
        type:String,
        required:[true,'userRoll is required']
    }
})

const User=mongoose.model('user',UserSchema);
module.exports=User;