
const uploadoncloudinary =require("../middlewares/cloudeinary.middleware.js")
const jwt =require("jsonwebtoken")
const usermodel = require("../models/usermodel.js")
const followersandfollowedtomodel = require("../models/followers.model.js")
const alliesmodel =require("../models/allais.model.js")
const postmodel=require("../models/postmodel.js")
// const { trusted } = require("mongoose")
const generateaccessandrefreshtokens=async(usreid)=>{
try{
const user= await usermodel.findById(usreid)
const accesstoken = await user.generateaccesstoken()
const refreshtoken =await  user.generaterefreshtoken()
user.refreshtoken=refreshtoken

await user.save({ validateBeforeSave: false })

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
  console.log(refreshtoken)
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
  return res.status(200).clearCookie("accesstoken",option).clearCookie("refreshtoken",option).json({success:true,reson:"user is successfilly loged out "})
  
  
} catch (error) {
  console.log(error)
  return res.status(400).json({success:false,reson:"the logout user failed "})
}

}
const refreshaccesstokenofuser=async(req,res)=>{
try{console.log("inside the controler")
const incomingrefreshtoken=req.cookies?.refreshtoken||req.body.refreshtoken;
if(!incomingrefreshtoken){
  console.log("refres token is required ")
  return res.status(400).json({
success:false,
reson:"refresh token is not there "

  })
}
const decodedtoken =await jwt.verify(incomingrefreshtoken,"lahgjsdhgvajsghvshdvbalisa__lkjbfv")
if(!decodedtoken){
  console.log("decoding of token failed")
console.log("refreshtoken is wrong")
return res.status(400).json({success:false,
  reson:"the given refreshtoken is wrong "
})
}
const user =await usermodel.findById(decodedtoken._id)
if(!user){
console.log("invalid user")
return res.status(400).json({success:false,
  reson:"user is invalid "
})
}
// console.log(incomingrefreshtoken)
// console.log(user?.refreshtoken)
if(incomingrefreshtoken!==user?.refreshtoken){

console.log("refresh token not match with data base token")
return res.status(400).json({success:false,reson:"given refresh token not matche with the stored token "})

}
const{accesstoken,refreshtoken}=await generateaccessandrefreshtokens(user._id)
const option= {
  httpOnly: true, // Security: prevents frontend JS from reading the cookie
      secure: true
  
  }
  return res.status(200).cookie("accesstoken",accesstoken,option).cookie("refreshtoken",refreshtoken,option).json({success:true})


}
catch(error){
  console.log(error)
  return res.status(400).json({success:false,
    reson:"you are in the catch block "
  })
}


}
const getuserprofile =async(req,res)=>{
try {
  const {username }=req.params
  if(!username){
  console.log("user name is required in url")
  return res.status(400).json({success:false,reson:"the username  is not found  "})
  }
  const user =await usermodel.findOne({username:username})
  
  const channel =await usermodel.aggregate([
  {$match:{
  username:username?.toLowerCase()//here we check for the data wher user name match 
  
  }},
 { $lookup:{
  from:"followersandfollowedtomodels",
  localField:"_id",
  foreignField:"channels",
  as:"followers"
  
  }},
 { $lookup:{
  from:"followersandfollowedtomodels",
  localField:"_id",
  foreignField:"follower",
  as:"followed"
  }},
  {$addFields:{
  followerscount:{$size:{$ifNull: ["$followers", []]} },
  following:{$size:{$ifNull: ["$followed", []]} },
  isfollowed:{$cond:{
  if:{$in:[user._id,"$followers.follower"]},
  then:true,
  else:false
  }}
  }},
 { $project:{
  username:1,
  followerscount:1,
  following:1,
  avatar:1,
  fullname:1,
  timestamps:1,
  isfollowed:1
  }
  }
  
  
  
  
  
  ])
  if(!channel?.length){
  console.log("channel dont exist may be user name is wrong  ")
  return res.status(400).json({success:false,reson:"may be the user name given is wrong "})
  
  }
  console.log("every thing is fine and our controllerb is working fine ")
  return res.status(200).json({channel:channel[0]})
  
} catch (error) {
  console.log(error)
return res.status(400).json({success:false,reson:"you are in side the catch folder of controller "})

}
}
const uploadpost =async(req,res)=>{
try {
  
  const{tittle,description}=req.body
  if (!tittle) {
    console.log("tittle is required ")
    return res.status(400).json({success:false,reson:"tittle is required for posting "})
  }
const postlocation=req.files?.postcontent[0]?.path;
const postcontent =await uploadoncloudinary(postlocation)



if(!postcontent||!tittle){
console.log("post and tittles are required")
return res.status(400).json({success:false,reson:"post and tittle is required "})
}
const post = new postmodel({tittle,description,postcontent:postcontent?.url||""})   
 await post.save();
return res.status(200).json({success:true ,reson:"post is successfully done ",url:post})


} catch (error) {
  console.log ("you are in the catch block")
  console.log(error)
  return res.status(400).json({success:false,reson:"you are in side the catch block"})
}


}
const myposts =async(req,res)=>{
try {
  const {username }=req.params
 if(!username){
  console.log("user name is required in url")
  return res.status(400).json({success:false,reson:"the username  is not found  "})
  }
  const user =await usermodel.findOne({username:username})
  const posts =await usermodel.aggregate([
  {$match:{
  username:username?.toLowerCase()//here we check for the data wher user name match 
  
  }},
 { $lookup:{
  from:"postmodel",
  localField:"_id",
  foreignField:"postby",
  as:"posts"
  
  }},
 
  {$addFields:{
  posts:{$ifNull: ["$posts", []]} }
 
  },
 { $project:{
  username:1,
  followerscount:1,
  avatar:1,
  post:1,
  
  isfollowed:1
  }
  }
  
  
  
  
  
  ])
if(!posts){
  console.log("therre are no posts you are in if satatement")
  return res.status(400).json({success:false,reson:"there are no posts "})
}
 console.log("every thing is fine and our controllerb is working fine ")
  return res.status(200).json({posts:posts[0]})


} catch (error) {
  console.log("you are inside the catch block")
  return res.status(500).json({success:false,reson:"youn are inside the catch block"})
}


}
const follow =async(req,res)=>{
try {
  const channelname =req.params;
const username=req.body
if(!channelname||!username){
console.log("user and channel is required for the follow ")
return res.status(400).json({success:false,reson:"user or channel is not there "})

}
if(channelname===username){console.log("you can not follow youer self ")
  return res.status(400).json({success:false,reson:"you cant follow your self "})
}
const user =await usermodel.findOne(username)
const channel =await usermodel.findOne(channelname)
 const alredyfolllowed= await followersandfollowedtomodel.findOne({follower:user,channels:channel})
if(alredyfolllowed){console.log("you alredy follow this channel")
  return res.status(400).json("you alredy follow this channel")
}
await followersandfollowedtomodel.create({follower:user,channels:channel})
console.log("saved the follower in data base")
const ismutual= await followersandfollowedtomodel.findOne({follower:channel,channels:user})
if (ismutual) {
  console.log("you are mutual followers ")
  await alliesmodel.create({allie1:user,allie2:channel})
  return res.status(200).json({success:true,reson:"you are now allies "})
}
console.log("you are not allies ")
return res.status(200).json({success:true,reson:"you follwed successfully waiting for be an allie"})
} catch (error) {
  console.log("youn are inside the catch block")
  console.log(error)
  return res.status(500).json({success:false,reson:"you are inside the catch block "})
}

}




module.exports={registeruser,loginuser,logoutuser,refreshaccesstokenofuser,getuserprofile,uploadpost, myposts,follow}