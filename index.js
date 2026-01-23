const express = require('express');
const app =express();
const port =3000;
const connectdb = require("./database/db.js");
connectdb();


app.listen(port,()=>{console.log ("app is online now ")});
