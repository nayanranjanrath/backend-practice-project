const{Schema,Model}=require('express')
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
const usermodel = model("User",userschema)

module.exports=usermodel;