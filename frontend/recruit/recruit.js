function goHome(){

window.location.href=
"http://localhost:3000/homepage/homepage.html";

}


async function loadNavbar(){

const username = localStorage.getItem("username");

if(!username){

window.location.href =
"http://localhost:3000/loginpage/loginpage.html";

return;

}

document.getElementById("navUsername").textContent = username;

try{

 const viewer = localStorage.getItem("username");

const res = await fetch(
  `http://localhost:3000/api/${username}?viewer=${viewer}`
);
if(!res.ok){
throw new Error("Profile fetch failed");
}

const data = await res.json();
console.log(data)
if(data.channel && data.channel.avatar){

document.getElementById("navAvatar").src =
data.channel.avatar;

}

}catch(err){

console.log("avatar load error", err);

}

}

document
.getElementById("recruitForm")
.addEventListener("submit", async function(e){

e.preventDefault();

const username = localStorage.getItem("username");

const gamename =
document.getElementById("gamename").value.trim();

const platform =
document.getElementById("platform").value;

const numofplayer =
document.getElementById("numofplayer").value;

const description =
document.getElementById("description").value;

const message =
document.getElementById("message");


try{

const res = await fetch(

`http://localhost:3000/api/${username}/recruit`,

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

recruiter:username,
gamename:gamename,
platform:platform,
numofplayer:numofplayer,
description:description

})

}

);


const data = await res.json();


if(res.status === 200){

message.textContent =
"Recruitment created successfully!";

message.style.color = "#22d3ee";

document.getElementById("recruitForm").reset();

}else{

message.textContent =
data.reason || "Failed to create recruit";

message.style.color = "red";

}


}catch(error){

console.error(error);

message.textContent = "Server error";

message.style.color = "red";

}

});


loadNavbar();