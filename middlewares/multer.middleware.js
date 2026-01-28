const multer = require("multer")
const storage = multer.diskStorage({
destination : function(req,file,cb){
cb(null,"./localfolder/public")

},
filename: function(req,file,cb){
cb(null,file.originalname)

}


})
const upload =multer({storage});
module.exports=upload;