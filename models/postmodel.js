const{Schema,model}=require('mongoose')
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
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
    postschema.plugin(aggregatePaginate)
const  postmodel= model("postmodel",postschema)

module.exports= postmodel;