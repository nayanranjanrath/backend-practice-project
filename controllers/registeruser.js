
const uploadoncloudinary =require("../middlewares/cloudeinary.middleware.js")

const usermodel = require("../models/usermodel.js")
const generateaccessandrefreshtokens=async(usreid)=>{
try{
const user= await usermodel.findById(usreid)
const accesstoken = await user.generateaccesstoken()
const refreshtoken =await  user.generaterefreshtoken()
user.refreshtoken=refreshtoken
await user.save({validatebeforesave:false})

return{accesstoken,refreshtoken}
}
catch(error){console.error(error)
throw new Error("something wrong while generating ");


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
try {
  const{username,email,password}=req.body
  if(!(username||email)){
    throw console.error("username or email is required")
   return res.status(400).json({
      success:false
    })
  }
  const user = await usermodel.findOne(
   { $or: [{username},{email}]}
  )
  if(!user){
   console.log("user is new ");
  return res.status(400).json({reson:"user need to login first "})
  
  }
  const ispasswordvalid =await  user.ispasswordcorrect(password)
  if(!ispasswordvalid){
     console.log("password is incorect");
  return res.status(400).json({reson:"password is incorrect "})
  
  }
  const {accesstoken,refreshtoken}=await generateaccessandrefreshtokens(user._id)
  const option= {
  httpOnly: true, // Security: prevents frontend JS from reading the cookie
      secure: true
  
  }
  return res.status(200).cookie("accesstoken",accesstoken,option).cookie("refreshtoken",refreshtoken,option).json({success:true})
} catch (error) {
  console.log(error)
   return res.status(400).json({message:"this is in catch part "})

}

}
const logoutuser = async(req,res)=>{
try {
  usermodel.findByIdAndUpdate(req.user._id,{$set:{refreshtoken:undefined}},{new:true})
  const option= {
    httpOnly: true, // Security: prevents frontend JS from reading the cookie
        secure: true
    
    }
  return res.status(200).clearcookie("accesstoken",option).clearcookie("refreshtoken",option).json({success:true,reson:"user is successfilly loged out "})
  
  
} catch (error) {
  return res.status(400).json({success:false,reson:"the logout user failed "})
}

}





module.exports={registeruser,loginuser,logoutuser}