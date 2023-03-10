const mongoose=require('mongoose');

const CourseSchema=new mongoose.Schema({
    courseName:{
        type:String,
        required:[true,'Course-Name is required']
    },
    startDate:{
        type:String
    },
    endDate:{
        type:String
    },
    description:{
        type:String
    },
    recordingLink:[{
        type:String
    }],
    repoLink:[{
        type:String
    }],
    enrolled:{
        type:Boolean
    },
    progressBar:{
        type:Number
    },
    sgo:{
        type:String,
        required:[true,'sgo is required']
    }

})


const Course=mongoose.model('course',CourseSchema);
module.exports=Course;