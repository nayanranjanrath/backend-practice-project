const express=require ('express')
const upload =require("../middlewares/multer.middleware.js")
const authuser =require("../middlewares/authuser.middleware.js")
const router = express.Router()
const {registeruser,loginuser,logoutuser}=require("../controllers/registeruser")

router.post('/register',upload.fields([{
name:"avatar",
 maxCount: 1,


}])
    
    ,registeruser)
router.post('/login',loginuser)
router.post('/logout',authuser,logoutuser)
module.exports=router
