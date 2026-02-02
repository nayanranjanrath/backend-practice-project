const jwt =require("jsonwebtoken")
const usermodel =require("../models/usermodel")
const verifayjwt =async(req,res,next)=>{
try{
    console.log("enter the auth middlrware ")
const token = req.cookies?.accesstoken||req.header("Authorization")?.replace("Bearer ", "")
console.log("tryed to get token ")
if(!token){
    console.error("accesscode is wrong");
    
return res.json({
    success:false,message:"access token is wrong "
})

}
const decodedtoken = await jwt.verify(token,"lahgjsdhgvajsghvshdvbalisa__lkjbfv")
const user =await usermodel.findById(decodedtoken?._id).select("-password -refreshtoken")
if(!user){
    return res.status(200).json({success:falsed,reson:"accesstoken was not correct "})
}
req.user =user  //this will add a new fild user inside the req where all of our user data thjat we can access in conroller  
next()
}
catch(error){
    console.log(error)
return res.json({success:false,reson:"you are inside catch block of the auth middleware"})


}

}


module.exports =verifayjwt