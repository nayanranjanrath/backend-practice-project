

const{Schema,model}=require('mongoose')
const bcrypt= require('bcrypt')
const jwt =require('jsonwebtoken');
const access_secrate="fhdsgierufivubherigv_friyg";

const refresh_secrate ="lahgjsdhgvajsghvshdvbalisa__lkjbfv";
// const { model, default: mongoose } = require('mongoose')
const userschema = new Schema(
    {
username:{
type:String,
required:true,
unique:true,
lowercase:true,
maxlength:50
},
email:{
type:String,
lowercase:true,
unique:true ,
required:true,
},
fullname:{
type:String,


},
password:{
type:String,
required:true

},
allies:{

type:Schema.Types.ObjectId,
ref:"usermodel"


},
avatar:{
    type:String
},
refreshtoken:{
    type:String
}

    },
{timestamps:true,
    
 }

)
userschema.pre("save",async function () {
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
    
    } 
    
})
userschema.methods.ispasswordcorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}

userschema.methods.generateaccesstoken= async function(){
const accesstoken =await  jwt.sign({
    _id:this._id,
},access_secrate, {
    expiresIn:"1d"
}
)
return accesstoken
}
userschema.methods.generaterefreshtoken=async function(){
 const refreshtoken=await  jwt.sign({
    _id:this._id,
},refresh_secrate, {
    expiresIn:"10d"
}
)
return refreshtoken
}


const usermodel = model("usermodel",userschema)

module.exports=usermodel;