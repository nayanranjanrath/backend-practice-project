const express=require ('express')
const upload =require("../middlewares/multer.middleware.js")
const router = express.Router()
const registeruser=require("../controllers/registeruser")

router.post('/user',upload.fields([{
name:"avatar",
 maxCount: 1,


}])
    
    ,registeruser)

module.exports=router
