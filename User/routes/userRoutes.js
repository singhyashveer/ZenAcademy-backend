const express=require('express');
const { addUser, getUser, editUser, deleteUser} = require('../controllers/userController');

const router=express.Router();


router.route('/')
    .post(addUser)
    
router.route('/:id')
    .get(getUser)
    .put(editUser)

router.route('/:email')
    .delete(deleteUser)
    


module.exports=router