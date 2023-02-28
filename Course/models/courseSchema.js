const mongoose=require('mongoose');

const CourseSchema=new mongoose.Schema({
    courseName:{
        type:String,
        required:[true,'Course-Name is required']
    },
    courseId:{
        type:Number,
        required:[true,'CourseID is required']
    },
    startDate:{
        type:String,
        required:[true,'Start Date is required']
    },
    endDate:{
        type:String,
        required:[true,'End Date is required']
    },
    description:{
        type:String
    },
    recordingLink:{
        type:String
    },
    repoLink:{
        type:String
    },
    enrolled:{
        type:Boolean
    },
    progressBar:{
        type:Number
    }

})


const Course=mongoose.model('course',CourseSchema);
module.exports=Course;