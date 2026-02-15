const{Schema,model}=require('mongoose')
// const { model, default: mongoose } = require('mongoose')
const alliesschema  = new Schema({
allie1:{

type:Schema.Types.ObjectId,
ref:"usermodel"

},
allie2:{

type:Schema.Types.ObjectId,
ref:"usermodel"

}




},{timestamps:true })
const  alliesmodel= model("alliesmodel",alliesschema)

module.exports= alliesmodel;