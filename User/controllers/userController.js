const User=require('../models/userSchema')

const bcrypt = require('bcrypt')

const addUser=async(req,res)=>{
    try{
        const newUser=new User(req.body);

        const salt=await bcrypt.genSalt(10);

        newUser.password=await bcrypt.hash(newUser.password, salt);

        await newUser.save();
        res.status(201).json({success:true,data:newUser});
    }
    catch(err)
    {
        res.status(400).json({success:false,data:err.message})
    }
}

const getUser=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user){
            return(res.status(404).json({success:false,data:"User Not Found"}));
        }
        res.status(200).json({success:true,data:user});
    }
    catch(e){
        res.status(400).json({success:false,data:e.message});
    }
}


const editUser=async(req,res)=>{
    const updates = Object.keys(req.body);
    try {
        const user = await User.findOne({
            _id: req.params.id,
        });
        console.log(user)
        if(!user) {
            return res.status(404).json({
                success:false,
                data:"No user With given id"
            });
        }
        updates.forEach((update) => user[update] = req.body[update]);
        const updatedUser=await user.save();
        res.status(200).json({success:true,user:updatedUser});
    } catch (e) {
        res.status(400).json({success:false,data:e.message});
    }
}

const deleteUser =  async(req,res)=>{
    try{
        User.findOneAndRemove(
            { email: req.params.email },
            function (err, result) {
                if (result == null) {
                    res.json({
                        message: "No user found with this mail",
                    });
                }
                else {
                    res.json({
                        message: "Successfully deleted the user",
                        User: result,
                    });
                }
            });
    }catch (e) {
        res.status(400).json({success:false,data:e.message});
    }
}




module.exports = {
    addUser,
    getUser,
    editUser,
    deleteUser
}