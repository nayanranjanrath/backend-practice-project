
const uploadoncloudinary =require("../middlewares/cloudeinary.middleware.js")

const usermodel = require("../models/usermodel.js")
const generateaccessandrefreshtokens=async(usreid)=>{
try{
const user=usermodel.findById(usreid)
const accesstoken = user.generateaccesstoken()
const refreshtoken = user.generaterefreshtoken()
user.refreshtoken=refreshtoken
await user.save({validatebeforesave:false})

return{accesstoken,refreshtoken}
}
catch(error){console.error(error)
res.status(400).json({message:"something went wrong "})

}

}
const registeruser = async (req,res) =>{
try{

  console.log(">>> registerUser controller reached");
const{username,email,fullname,password}=req.body
     if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required"
      });
    }
const existinguser= await usermodel.findOne(
  {$or:[ {email},{username}]   }
)
if(existinguser){
  return res.status(300).json({success:"false",
    message:"user alrady exist" ,
  })
}

    
     const avatarlocation =req.files?.avatar[0]?.path;
 const avatar = await uploadoncloudinary (avatarlocation)



const user = new usermodel({username,email,fullname,password,avatar:avatar?.url||""})   
 await user.save();

 res.status(200).json({message:"success",
  user
 });
 
}
catch(error){  console.error(error);
    return res.status(409).json({
      message: "Internal server error"
    });
  
}
}
const loginuser=async(req,res)=>{
const{username,email,password}=req.body
if(!username||!email){
  throw console.error("username or email is required")
 return res.status(400).json({
    success:false
  })
}
const user = await usermodel.findOne(
 { $or: [{username},{email}]}
)
if(!user){
throw console.error("user is new ");
return res.status(400).json({reson:"user need to login first "})

}
const ispasswordvalid =await  user.ispasswordcorrect
if(!ispasswordvalid){
  throw console.error("password is incorect");
return res.status(400).json({reson:"password is incorrect "})

}
const {accesstoken,refreshtoken}=await generateaccessandrefreshtokens(user._id)

}
module.exports=registeruser