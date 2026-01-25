const{Schema,Model}=require('express')
const bcrypr= require('bcrypt')
const { model, default: mongoose } = require('mongoose')
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


},
allies:{

type:Schema.type.objectid,
Ref:"User"


},
avatar:{
    type:String
}
    },
{timestamp:true }
)
userschema.pre("save",async function (next) {
    if(this.ismodified("password")){
        this.password=await bcrypr.hash(this.password)
        next()
    } 
        return next()
})
userschema.method.ispasswordcorrect=async function (password) {
    return await bcrypr.compare(password,this.password)
}


const usermodel = model("User",userschema)

module.exports=usermodel;