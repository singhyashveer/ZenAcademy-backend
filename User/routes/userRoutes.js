const express=require('express');
const { addUser, getUser, editUser} = require('../controllers/userController');

const router=express.Router();


router.route('/')
    .post(addUser)
    
router.route('/:id')
    .get(getUser)
    .put(editUser)
    


module.exports=router