const express=require('express');
const { addUser, listAllUser ,getUserById , searchUser, getUser, editUser, deleteUser ,bookmark, login, logOut} = require('../controllers/userController');
const refresh=require('../controllers/generateAccessToken')
const verifyJWT=require('../middleware/verifyJWT')

const router=express.Router();


router.route('/')
    .post(verifyJWT,addUser)
    .get(verifyJWT,getUser)


router.route('/login').post(login);
router.route('/logout').get(verifyJWT,logOut);

router.route('/token').get(refresh);

router.route('/users').get(verifyJWT,listAllUser)
router.route('/search').get(verifyJWT,searchUser)
router.route('/bookmark').put(verifyJWT,bookmark)
    
router.route('/:id')
    .get(verifyJWT,getUserById)
    .put(verifyJWT,editUser)
    .delete(verifyJWT,deleteUser)
    

module.exports=router