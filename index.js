const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const http=require('http')
const {Server}=require('socket.io')

const cookieParser = require('cookie-parser')
const express = require('express');
const app =express();
const server =http.createServer(app)


const io = new Server(server, {
  cors: {
    origin: "*",//this line helps us to connect our server if also our servers are not in the same port 
  },
});


const port =3000;
const connectdb = require("./database/db.js");
connectdb();
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // for form data
const registerrouter=require("./routes/registerrouter.js")
app.use('/api',registerrouter)

server.listen(port,()=>{console.log ("app is online now ")});
