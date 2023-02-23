const express=require('express');
const { addUser, listAllUser ,searchUser, editUser, deleteUser , login, logOut} = require('../controllers/userController');
const refresh=require('../controllers/generateAccessToken')
const verifyJWT=require('../middleware/verifyJWT')

const router=express.Router();


router.route('/')
    .post(verifyJWT,addUser)


router.route('/login').post(login);
router.route('/logout').get(verifyJWT,logOut);

router.route('/token').get(refresh);

router.route('/users').get(verifyJWT,listAllUser)
    
router.route('/:id')
    .get(verifyJWT,searchUser)
    .put(verifyJWT,editUser)
    .delete(verifyJWT,deleteUser)
    


module.exports=router