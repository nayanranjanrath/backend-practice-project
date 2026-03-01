const   v2 = require('cloudinary');
const fs = require("fs");
   

    // Configuration
    v2.config({ 
        cloud_name: 'drlyrujjw', 
        api_key: '666994832992633', 
        api_secret: 'SSj6u6n4AtyJc11JMI-QODyqO-k' // Click 'View API Keys' above to copy your API secret
    });
  const uploadoncloudinary=async(localpath)=>{
try{

    if(!localpath){return null}
const response = await v2.uploader.upload(localpath,{resource_type:"auto"})
console.log("file is uploaded into cloudinary ",response.url)
 if (fs.existsSync(localpath)) {
      fs.unlinkSync(localpath);
    }

return response;
}
catch(error){
fs.unlinkSync(localpath)
console.log("something is wrong i dont know why this is not working ",error)
return null;
}
  }  
     

module.exports=uploadoncloudinary ;