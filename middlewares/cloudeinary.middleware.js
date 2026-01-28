import { v2 as cloudinary } from 'cloudinary';
const fs = require("fs");
   

    // Configuration
    cloudinary.config({ 
        cloud_name: 'drlyrujjw', 
        api_key: '666994832992633', 
        api_secret: 'SSj6u6n4AtyJc11JMI-QODyqO-k' // Click 'View API Keys' above to copy your API secret
    });
  const uploadoncloudinary=async(localpath)=>{
try{

    if(!localpath){return null}
const response = await cloudinary.uploader.upload(localpath,{resource_type:"auto"})
console.log("file is uploaded into cloudinary ",response.url)
fs.unlinkSync(localpath);

return response;
}
catch(error){
fs.unlinkSync(localpath)
console.log("something is wrong i dont know why this is not working ",error)
return null;
}
  }  
     

module.exports=uploadoncloudinary ;