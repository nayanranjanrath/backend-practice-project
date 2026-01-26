const{Schema,model}=require('mongoose')
// const { model, default: mongoose } = require('mongoose')
const postschema  = new Schema(
    {
post:{
type:String,
required:true,

},
tittle:{
type:String,
required:true,
},
postby:{
type:Schema.type.objectid,
ref:"User"

},
description:{
type:String,


},
likes:{
    type:Number,
    default:0,
}

    },{timestamps:true })
const  postmodel= model("postmodel",postschema)

module.exports= postmodel;