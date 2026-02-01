const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const cookieParser = require('cookie-parser')
const express = require('express');
const app =express();
const port =3000;
const connectdb = require("./database/db.js");
connectdb();
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // for form data
const registerrouter=require("./routes/registerrouter.js")
app.use('/api',registerrouter)

app.listen(port,()=>{console.log ("app is online now ")});
