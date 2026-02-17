const express=require ('express')
const upload =require("../middlewares/multer.middleware.js")
const authuser =require("../middlewares/authuser.middleware.js")
const router = express.Router()
const {registeruser,loginuser,logoutuser, refreshaccesstokenofuser,getuserprofile,uploadpost,myposts,follow,allieslist,gamedetails}=require("../controllers/registeruser")

router.post('/register',upload.fields([{
name:"avatar",
 maxCount: 1,


}])
    
    ,registeruser)
router.post('/login',loginuser)
router.post('/logout',authuser,logoutuser)
router.post('/rejoin',refreshaccesstokenofuser)
router.get('/:username',getuserprofile)
router.post('/post',upload.fields([{
name:"postcontent",
}]),uploadpost)
router.get('/:username/posts',myposts)
router.post('/:username/follow',follow)
router.get('/:username/allies',allieslist)
router.post('/:username/addgamesplayed',gamedetails)

module.exports=router
