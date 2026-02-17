const{Schema,model}=require('mongoose')
// const { model, default: mongoose } = require('mongoose')
const gamesplayedschema  = new Schema(
    {
gamenamelower:{
type:String,
required:true,
maxlength:50
},
numberoftimecompleated:{
type:Number,
required:true,
},
user:{
type:Schema.Types.ObjectId,
ref:"usermodel"



},
platformgeneral:{
type:String,
enum: ["pc", "console", "mobile"],
    default: "pc"

},
review:{
    type:String
},
stars:{
    type:Number,
    enum: [1,2,3,4,5],
required:true
}

    },{timestamps:true })
const  gamesplayedmodel= model("gamesplayedmodel",gamesplayedschema)

module.exports= gamesplayedmodel;