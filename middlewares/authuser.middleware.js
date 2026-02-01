const jwt =require("jsonwebtoken")
const usermodel =require("../models/usermodel")
const verifayjwt =async(req,res,next)=>{
try{
const token =req.cookies?.accesstoken||req.header("authorization")?.replace("bearer","")
if(!token){
return res.send("accesscode is wrong").json({
    success:false,message:"access token is wrong "
})

}
const decodedtoken =jwt.verify(token,"fhdsgierufivubherigv_friyg")
const user =await usermodel.findById(decodedtoken?._id).select("-password -refreshtoken")
if(!user){
    return res.status(200).json({success:falsed,reson:"accesstoken was not correct "})
}
req.user =user  //this will add a new fild user inside the req where all of our user data thjat we can access in conroller  
next()
}
catch(error){
return res.jaon({success:false,reson:"you are inside catch block of the auth middleware"})


}

}


module.exports =verifayjwt