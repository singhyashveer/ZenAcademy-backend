const express=require('express');
const { addUser, listAllUser ,getUserById , searchUser, getUser, editUser, deleteUser ,bookmark, viewBookmark, login, logOut, assignCourse, viewAssignedCourses, dashboard} = require('../controllers/userController');
const refresh=require('../controllers/generateAccessToken')
const verifyJWT=require('../middleware/verifyJWT')

const router=express.Router();


router.route('/')
    .post(verifyJWT,addUser)
    .get(verifyJWT,getUser)


router.route('/login').post(login);
router.route('/logout').get(verifyJWT,logOut);

router.route('/dashboard').get(verifyJWT,dashboard)

router.route('/token').get(refresh);

router.route('/users').get(verifyJWT,listAllUser)
router.route('/search').get(verifyJWT,searchUser)
router.route('/bookmark').put(verifyJWT,bookmark)
router.route('/bookmark/view').get(verifyJWT,viewBookmark)
router.route('/assignCourse').put(verifyJWT,assignCourse)
router.route('/assignCourse/view').get(verifyJWT,viewAssignedCourses)
    
router.route('/:id')
    .get(verifyJWT,getUserById)
    .put(verifyJWT,editUser)
    .delete(verifyJWT,deleteUser)
    

module.exports=router