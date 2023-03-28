const User=require('../models/userSchema')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios=require('axios')
const { response } = require('express')

const addUser=async(req,res)=>{
    try {
        if(req?.user?.userRoll!=='admin')
            return res.status(401).json({success:false,data:"unathorised access"})
        const user = await User.findOne({userName:req?.body?.userName})
        if(user)
            return res.status(209).json({success:false,data:"Given username is already registered"})
        const newUser=new User(req.body);
       
        const salt=await bcrypt.genSalt(10);
        newUser.password=await bcrypt.hash(newUser.password, salt);

        await newUser.save();
        res.status(201).json({success:true,data:newUser});
	} catch (err) {
		res.status(400).json({success:false,data:err.message})
	}
}

const listAllUser=async(req,res)=>{
    if(req.user.userRoll==="admin"||req.user.userRoll==="sgo"||req.user.userRoll==="l&d"){
        
        try{
            const users=await User.find({userRoll:{$ne:'admin'}});
            res.status(200).json({success:true,data:users});
        }
        catch(err){
            res.status(400).json({success:false,data:err.message});
        }
    }
    else
        return(res.status(401).json({success:false,data:"Unauthorize Access"}));
    
}
const getUserById=async(req,res)=>{
    if(req.user.userRoll==="admin"||req.user.userRoll==="sgo"||req.user.userRoll==="l&d"){

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
    else
        return(res.status(401).json({success:false,data:"Unauthorized Access"}));
}

const searchUser=async(req,res)=>{
    if(req.user.userRoll!=="admin")
        return(res.status(401).json({success:false,data:"Unauthorized Access"}));
    try{
        const {userName,name}=req.query;
        const queryObj={};
        if(name){
            queryObj.name=name;
        }
        if(userName){
            queryObj.userName=userName;
        }
        const employees=await User.find(queryObj);
        if(!employees){
            res.status(404).json({success:false,data:"No employee present with given details"});
        }
        res.status(200).json({success:true,data:employees});
    }
    catch(err){
        res.status(400).json({success:false,data:err.message})
    }
}

const getUser = async(req,res)=>{
    try{
        const user = await User.findOne({userName:req.user.userName})
        res.status(200).json({success:true,data:user})
    }catch(err){
        res.status(400).json({success:false,data:err.message})
    }
}


const editUser=async(req,res)=>{
    if(req.user.userRoll!=="admin")
        return(res.status(401).json({success:false,data:"Unauthorize Access"}));
    const updates = Object.keys(req.body);
    try {
        const user = await User.findOne({
            _id: req.params.id,
        });
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

const deleteUser=async(req,res)=>{
    try{
        console.log(req.user.userRoll)
        if(req.user.userRoll==='admin'){
            const { id: userid } = req.params
            const dUser = await User.findOneAndDelete({ _id: userid  })
            if (!dUser) {
                return res.status(400).json({success:false,data:"no user with the given id"})
            } 
            res.status(200).json({success:true,data:dUser })
        }else{
            const result = await User.deleteOne({userName : req.user.userName});
            if(!result){
                return res.status(400).json({success:false,data:"User with given credentials not found"})
            } 
            res.status(200).json({ success: true, data: result });
        }   
    }catch(err){
        res.status(400).json({success:false,data:err.message})
    }
}

const login=async(req,res)=>{
    const {userName,password}=req.body;
    if(!userName || !password)
        return res.status(400).json({success:false,data:"please provide both the fields"});
    try{
        const user=await User.findOne({userName});
        if(!user)
            return res.status(400).json({success:false,data:"no user found with given credentials"});

        const match=await bcrypt.compare(password,user.password);
        if(!match)
            return res.status(400).json({success:false,data:"please provide valid credentials"});
        const accessToken=jwt.sign(
            {
                "userName":userName,
                userRoll:user.userRoll 
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'1h'}
        );
        const refreshToken=jwt.sign(
            {"userName":userName},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:"1d"}
        );
        // Create secure cookie with refresh token 
        res.cookie('jwt', refreshToken, {
            httpOnly: true, //accessible only by web server 
            secure: true, //https
            sameSite: 'None', //cross-site cookie 
            maxAge: 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
        })
        res.status(200).json({success:true,userRoll:user.userRoll,accessToken});
    }catch(err){
        console.log(err.message);
        res.status(400).json({success:false,data:err.message});
    }
}

const logOut=async(req,res)=>{
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ success:true,message: 'Cookie cleared' })
}

const bookmark=async(req,res)=>{
    try{
        if(req.user.userRoll==='employee'){

            const {bookmarkedCourses}=req.body;
            const user=await User.findOne({userName : req.user.userName})
            if(user.bookmarkedCourses.includes(bookmarkedCourses))
            {
                const bookmark= await User.findOneAndUpdate({userName:req.user.userName},{$pull: { bookmarkedCourses: bookmarkedCourses } }, {new: true, runValidators: true})
                if (!bookmark)
                return res.status(404).json({success:false ,data: `User not found` })
                res.status(200).json({success:true,data:bookmark,xyz:0});
            }
            else
            {
                const bookmark= await User.findOneAndUpdate({userName:req.user.userName},{$push: { bookmarkedCourses: bookmarkedCourses } }, {new: true, runValidators: true})
                if (!bookmark)
                return res.status(404).json({success:false ,data: `User not found` })
                res.status(200).json({success:true,data:bookmark,xyz:1});
            }
            
        }
        else{
            return(res.status(401).json({success:false,data:"Unauthorized Access!! You can not bookmark Course"}));
        }
    }
    catch(e){
        res.status(400).json({success:false,data:e.message})
    }
}

const viewBookmark=async(req,res)=>{
    try{
        // console.log(req.user.userRoll)
        if(req.user.userRoll==='employee'){
            const user=await User.findOne({userName : req.user.userName})
            axios.defaults.headers.common = {'Authorization': `Bearer ${req.user.token}`}
            let bookmarked=[];

            // const promise=new Promise((resolve,reject)=>{

                
            // })
            const promises=[];
            if(user.bookmarkedCourses){
                user.bookmarkedCourses.forEach((bookmarkID)=>{
                    const pr=axios.get(`http://localhost:5002/course/${bookmarkID}`);
                    promises.push(pr);
                })
                const response=await Promise.all(promises);
                bookmarked=response.map(resp=>resp.data.data);
                return res.status(200).json({success:true,data:bookmarked});
            }

            // user.bookmarkedCourses.forEach(async(bookmarkID)=>{
            //     const response=await axios.get(`http://localhost:5002/course/${bookmarkID}`);
            //     bookmarked.push(response.data.data)
            //     console.log("insider ", bookmarked);
            // })
            // return(res.status(200).json({success:true,data:bookmarked}));
        }
        else
        return res.status(401).json({success:false,data:"unauthorised access"})
    }
    catch(e){
        res.status(400).json({success:false,data:e.message})
    }
}

const assignCourse=async(req,res)=>{
    try{
        if(req.user.userRoll==='sgo'||req.user.userRoll==='admin'){
            const{userID,assignedCourses}=req.body
            const user=await User.findOne({_id : userID})
            if(user.assignedCourses.includes(assignedCourses))
            return res.status(209).json({success:false,data:"Already assigned"})
            const assigned=await User.findOneAndUpdate({_id:userID},{$push: { assignedCourses: assignedCourses } }, {new: true, runValidators: true,})
            if(!assigned)
                return res.status(404).json({success:false ,data: `No User with id :${userID}` })
            res.status(200).json({success:true,data:assigned});
        }
        else
        return res.status(401).json({success:false,data:"unauthorised access"})
    }
    catch(e){
        res.status(400).json({success:false,data:e.message})
    }
}


const viewAssignedCourses=async(req,res)=>{
    try{

        if(req.user.userRoll==='employee')
        {
            const user=await User.findOne({userName : req.user.userName})
            axios.defaults.headers.common = {'Authorization': `Bearer ${req.user.token}`}
            let assigned=[];
            
            const promises=[];
            if(user.assignedCourses){
                user.assignedCourses.forEach((assignID)=>{
                    const pr=axios.get(`http://localhost:5002/course/${assignID}`);
                    promises.push(pr);
                })
                const response=await Promise.all(promises);
                assigned=response.map(resp=>resp.data.data);
                return res.status(200).json({success:true,data:assigned});
            }
        }
        else
        return res.status(401).json({success:false,data:"unauthorised access"})
    }
    catch(e){
        res.status(400).json({success:false,data:e.message})
    }
}


const sgoCourse=async(req,res)=>{
    try{
        if(req.user.userRoll==="employee"||req.user.userRoll==="sgo"||req.user.userRoll==="l&d")
        {
            const user=await User.findOne({userName : req.user.userName})
            const sgo=user.sgo;
            axios.defaults.headers.common = {'Authorization': `Bearer ${req.user.token}`}
            const result=await axios.get(`http://localhost:5002/course/`)
            const responses=result.data.data;
            const response1=responses.filter((response)=>{
                return response.sgo===sgo
            })
            // console.log(response1)
            return res.status(200).json({success:true,data:response1});
        }
        else
        return res.status(401).json({success:false,data:"unauthorised access"})
    }
    catch(e){
        res.status(400).json({success:false,data:e.message})
    }
}

const sgoUser=async(req,res)=>{
    try{
        if(req.user.userRoll==='sgo')
        {
            const user=await User.findOne({userName : req.user.userName})
            const sgo=user.sgo;
            const users=await User.find({userRoll:'employee'||'Employee'||'EMPLOYEE', sgo:sgo,});
            res.status(200).json({success:true,data:users});
        }
    }

    catch(e){
        res.status(400).json({success:false,data:e.message})
    }

}







module.exports = {
    addUser,
    listAllUser,
    getUserById,
    searchUser,
    getUser,
    editUser,
    deleteUser,
    bookmark,
    viewBookmark,
    assignCourse,
    viewAssignedCourses,
    sgoCourse,
    sgoUser,
    login,
    logOut
}