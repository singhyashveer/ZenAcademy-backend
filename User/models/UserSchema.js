const mongoose=require('mongoose');
const {isEmail}=require('validator');

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
        required:[true,'eMail is required'],
        validate: [ isEmail, 'invalid email' ]
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    userRoll:{
        type:String,
        enum: ["admin","employee","sgo","l&d"],
        required:[true,'userRoll is required']
    },
    sgo:{
        type:String,
        required:[true,'sgo is required']
    }
})

const User=mongoose.model('user',UserSchema);
module.exports=User;