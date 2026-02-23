const{Schema,model}=require('mongoose')
const gamechatschema  = new Schema({
recruiter:{

type:Schema.Types.ObjectId,
ref:"usermodel"

},
otherplayer:{

type:Schema.Types.ObjectId,
ref:"usermodel",

}
,
gamename:{
    type:String
}


},{timestamps:true })
const  gamechatmodel= model("gamechatmodel",gamechatschema)

module.exports= gamechatmodel;