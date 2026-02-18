const{Schema,model}=require('mongoose')
// const { model, default: mongoose } = require('mongoose')
const recruitmentschema  = new Schema(
    {

recruiter:{
type:Schema.Types.ObjectId,
ref:"usermodel"



},
applicant:{
type:Schema.Types.ObjectId,
ref:"usermodel"



},
platformgeneral:{
type:String,
enum: ["pc", "console", "mobile","outdoor"],
    default: "pc"

},
gamenamelower:{
    type:String,
    required:true
},
numofplayer:{
    type:Number,
    required:true
},
description:{
    type:String
}

    },{timestamps:true })
    
recruitmentschema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 } // 24 hours
);


const  recruitmentmodel= model("recruitmentmodel",recruitmentschema)

module.exports= recruitmentmodel;