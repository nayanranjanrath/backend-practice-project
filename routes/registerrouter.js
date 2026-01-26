const express=require ('express')

const router = express.Router()
const registeruser=require("../controllers/registeruser")

router.post('/user',registeruser)

module.exports=router
