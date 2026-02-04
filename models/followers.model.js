const{Schema,model}=require('mongoose')


const followersandfollowedtoschema  = new Schema(
{
follower:{

type:Schema.Types.ObjectId,
ref:"usermodel"

},
channels:{

type:Schema.Types.ObjectId,
ref:"usermodel"

}


}


)
const followersandfollowedtomodel = model("followersandfollowedtomodel",followersandfollowedtoschema)

module.exports=followersandfollowedtomodel;