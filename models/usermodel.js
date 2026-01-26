

const{Schema,model}=require('mongoose')
const bcrypt= require('bcrypt')
// const { model, default: mongoose } = require('mongoose')
const userschema = new Schema(
    {
username:{
type:String,
required:true,
unique:true,
lowercase:true,
maxlength:50
},
email:{
type:String,
lowercase:true,
unique:true ,
required:true,
},
fullname:{
type:String,


},
password:{
type:String,
required:true

},
allies:{

type:Schema.Types.ObjectId,
ref:"usermodel"


},
avatar:{
    type:String
}
    },
{timestamps:true,
    
 }

)
userschema.pre("save",async function () {
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
    
    } 
    
})
userschema.methods.ispasswordcorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}


const usermodel = model("usermodel",userschema)

module.exports=usermodel;