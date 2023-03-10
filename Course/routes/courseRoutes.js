const express=require('express');
const verifyJWT=require('../middleware/verifyJWT')
const {addCourse, getAllCourses, getCourseById, editCourse, deleteCourse, searchCourse, addRecordingLink, getRecordingLink}=require('../controllers/courseController')



const router=express.Router();


router.route('/').get(verifyJWT,getAllCourses);
router.route('/').post(verifyJWT,addCourse);

router.route('/search').get(verifyJWT,searchCourse);
router.route('/recordingLinks/:id').get(verifyJWT,getRecordingLink)
router.route('/addRecordingLinks').put(verifyJWT,addRecordingLink)

router.route('/:id')
    .get(verifyJWT,getCourseById)
    .put(verifyJWT,editCourse)
    .delete(verifyJWT,deleteCourse)







module.exports=router

