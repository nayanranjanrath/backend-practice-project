const{Schema,model}=require('mongoose')
// const { model, default: mongoose } = require('mongoose')
const gamesplayedschema  = new Schema(
    {
gamename:{
type:String,
required:true,
maxlength:50
},
numberoftimecompleated:{
type:Number,
required:true,
},
Playedby:{
type:Schema.type.objectid,
ref:"User"

},
platform:{
type:String,
enum: ["PC", "CONSOLE", "MOBILE"],
    default: "PC"

},
review:{
    type:String
}

    },{timestamps:true })
const  gamesplayedmodel= model("gamesplayedmodel",gamesplayedschema)

module.exports= gamesplayedmodel;