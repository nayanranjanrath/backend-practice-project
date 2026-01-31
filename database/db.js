const mongoose = require("mongoose");
const connectdb =async()=>{
try{
    
 await mongoose.connect('mongodb+srv://noxkiller5:Pancham2005@1stdatabase.lgjtkdw.mongodb.net/')
console.log("data base is successfully connected ")

}
catch(error){
console.log(error.message);
process.exit(1);

}
}

module.exports=connectdb;
