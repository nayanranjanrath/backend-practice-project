const{Schema,model}=require('mongoose')
const gamechatschema  = new Schema({
recruiter:{

type:Schema.Types.ObjectId,
ref:"usermodel"

},
applicant:[{

type:Schema.Types.ObjectId,
ref:"usermodel"

}
]



},{timestamps:true })
const  gamechatmodel= model("gamechatmodel",gamechatschema)

module.exports= gamechatmodel;