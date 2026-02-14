const{Schema,model}=require('mongoose')
// const { model, default: mongoose } = require('mongoose')
const postschema  = new Schema(
    {
postcontent:{
type:String,
required:true,

},
tittle:{
type:String,
required:true,
},
postby:{
type:Schema.Types.ObjectId,
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