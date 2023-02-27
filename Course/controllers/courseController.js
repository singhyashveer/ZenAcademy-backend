const Course=require('../models/courseSchema')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt')


const addCourse=async(req,res)=>{
    if(req.user.userRoll!=="admin")
        return(res.status(401).json({success:false,data:"Unauthorized Access"}));
    try{
        const course=new Course(req.body);
        await course.save();
        res.status(201).json({success:true,data:course});
    }
    catch(e){
        res.status(400).json({success:false,data:e.message});
    }
}

const getAllCourses=async(req,res)=>{
    if(req.user.userRoll==="admin"||req.user.userRoll==="sgo"||req.user.userRoll==="l&d"){

        try {
            const courses = await Course.find({})
            res.status(200).json({ success: true, data: courses })
        }
        catch (error) {
            res.status(400).json({ success:false,data: error.message })
        }
    }
    else
        return(res.status(401).json({success:false,data:"Unauthorized Access"}));
}

const getCourseById=async(req,res)=>{
    if(req.user.userRoll==="admin"||req.user.userRoll==="sgo"||req.user.userRoll==="l&d"){
    try{
        const course=await Course.findById(req.params.id);
        if(!course){
            return(res.status(404).json({success:false,data:"Course Not Found"}));
        }
        res.status(200).json({success:true,data:course});
    }
    catch(e){
        res.status(400).json({success:false,data:e.message});
    }
}
else
     return(res.status(401).json({success:false,data:"Unauthorized Access"}));
}


const editCourse=async(req,res)=>{
    if(req.user.userRoll!=="admin"){
        return(res.status(401).json({success:false,data:"Unauthorize Access"}));}
    const updates = Object.keys(req.body);
    try {
        const course = await Course.findOne({_id: req.params.id});
        if(!course) {
            return res.status(404).json({
                success:false,
                data:"No panel With given id"
            });
        }
        updates.forEach((update) => course[update] = req.body[update]);
        const updatedCourse=await course.save();
        res.status(200).json({success:true,candidate:updatedCourse});
    } catch (e) {
        res.status(400).json({success:false,data:e.message});
    }
}

const deleteCourse=async(req,res)=>{
    try{
        if(req.user.userRoll!=="admin"){
            return(res.status(401).json({success:false,data:"Unauthorize Access"}));}
        
        const course=await Course.findOneAndDelete({_id: req.params.id});
        if(!course) {
            return res.status(404).json({
                success:false,
                data:"No Course With given id"
            });
        }
        res.status(200).json({ success: true, data: course });
    }
    catch(err){
        res.status(400).json({success:false,data:err.message})
    }
}

const searchCourse=async(req,res)=>{
    if(req.user.userRoll==="admin"||req.user.userRoll==="sgo"||req.user.userRoll==="l&d"||req.user.userRoll==="employee")
    try{
        const {courseName}=req.query;
        const queryObj={};
        if(courseName){
            queryObj.courseName=courseName;
        }
        const courses=await Course.find(queryObj);
        if(!courses){
            res.status(404).json({success:false,data:"No course present with given details"});
        }
        res.status(200).json({success:true,data:courses});
    }
    catch(err){
        res.status(400).json({success:false,data:err.message})
    }
    else
    return(res.status(401).json({success:false,data:"Unauthorized Access"}));
}


module.exports={
    addCourse,
    getAllCourses,
    getCourseById,
    editCourse,
    deleteCourse,
    searchCourse
}