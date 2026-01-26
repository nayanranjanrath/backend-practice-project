

const usermodel = require("../models/usermodel.js")
const registeruser = async (req,res) =>{
try{
  console.log(">>> registerUser controller reached");
    const{username,email,fullname,password,avatar}=req.body
     if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required"
      });
    }
const existinguser=usermodel.find(
  {$or: ({email},{username}  ) }
)
if(existinguser){
  res.status(300).json({success:"false",
    message:"user alrady exist" ,
  })
}



const user = new usermodel({username,email,fullname,password,avatar})   
 await user.save();

 res.status(200).json({message:"success"});
 
}
catch(error){  console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  
}
}

module.exports=registeruser