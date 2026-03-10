function goHome(){

window.location.href =
"http://localhost:3000/homepage/homepage.html";

}

const username = localStorage.getItem("username");



/* ================= LOAD NAVBAR ================= */

async function loadNavbar(){

document.getElementById("navUsername").textContent =
username;

try{

 const viewer = localStorage.getItem("username");

const res = await fetch(
  `http://localhost:3000/api/${username}?viewer=${viewer}`
);
const data = await res.json();

const user = data.channel;

document.getElementById("navAvatar").src = user.avatar;

}catch(err){

console.log("avatar error");

}

}



/* ================= PRIVATE CHAT ================= */

async function loadAllies(){

try{



console.log("Sending username:", username);

const res = await fetch(
"http://localhost:3000/api/username/allies",
{
method: "POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
username: username
})

}
);

const data = await res.json();
const viewer_id =data.allies[0].id
console.log("Allies API response:", data);
console.log("Allies API response:", viewer_id);

const container = document.getElementById("alliesContainer");

container.innerHTML = "";


if(!data.allies){
console.log("No allies returned");
return;
}

data.allies.forEach(item=>{

const user = item.user;

const card = document.createElement("div");

card.className = "chat-card";

card.innerHTML = `
<img 
src="${user.avatar || 'default-avatar.png'}"
class="chat-avatar"
onerror="this.src='../login1.png'"
>
<span class="chat-name">${user.username}</span>
`;

card.onclick = ()=>{

window.location.href =
`http://localhost:3000/privetchat/privetchatfrontend.html?sender=${viewer_id}&receiver=${user._id}`;

};

container.appendChild(card);

});

}catch(error){

console.error("Allies load error:", error);

}

}



/* ================= GAME CHAT ================= */

async function loadGameChats(){

try{

const res = await fetch(
"http://localhost:3000/api/game/allgamechat",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
username:username
})

}
);

const data = await res.json();

const games = data.games;

const userId = data.userId._id;

const container =
document.getElementById("gameChatContainer");

container.innerHTML="";

for(let game of games){

let logo = "";

try{

const rawg = await fetch(
`https://api.rawg.io/api/games?key=d2baeb53430e46738e58026498e22258&search=${game.gamename}`
);

const rawgData = await rawg.json();

logo = rawgData.results[0].background_image;

}catch(err){

logo = "";

}

const card = document.createElement("div");

card.className = "chat-card";

card.innerHTML = `

<img src="${logo}" class="game-logo">

<span class="chat-name">
${game.gamename}
</span>

`;

card.onclick = ()=>{

window.location.href =
`http://localhost:3000/groupchat/groupchatfrontend.html?gamechatid=${game._id}&userid=${userId}`;

};

container.appendChild(card);

}

}catch(err){

console.log("game chat error");

}

}



loadNavbar();

loadAllies();

loadGameChats();