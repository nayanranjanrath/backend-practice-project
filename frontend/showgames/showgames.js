const RAWG_KEY="d2baeb53430e46738e58026498e22258";

const username=localStorage.getItem("username");

document.getElementById("navUsername").textContent=username;


/* LOAD AVATAR */

async function loadAvatar(){

try{

 const viewer = localStorage.getItem("username");

const res = await fetch(
  `http://localhost:3000/api/${username}?viewer=${viewer}`
);

const data=await res.json();

document.getElementById("navAvatar").src=
data.channel.avatar || "default-avatar.png";

}catch{

document.getElementById("navAvatar").src="default-avatar.png";

}

}

loadAvatar();


/* TOAST */

function showToast(msg){

const toast=document.getElementById("toast");

toast.textContent=msg;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},3000);

}


/* LOAD GAMES */

async function loadGames(){

try{

const res=await fetch(

"http://localhost:3000/api/user/game/gamesplayed",

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

const data=await res.json();

const games=data.games;

const container=document.getElementById("gamesContainer");

container.innerHTML="";

if(!games || games.length===0){

container.innerHTML="<p>No games played yet</p>";

return;

}

for(const game of games){

let image="";

try{

const rawg=await fetch(

`https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${game.gamenamelower}`

);

const rawgData=await rawg.json();

image=rawgData.results?.[0]?.background_image;

}catch{

image="";

}

/* STARS */

let stars="";

for(let i=0;i<game.stars;i++){

stars+="⭐";

}

const card=document.createElement("div");

card.className="game-card";

card.innerHTML=`

<img
src="${image || 'https://via.placeholder.com/300x200?text=Game'}"
class="game-logo"
>

<div class="game-name">
${game.gamenamelower}
</div>

<div class="info">
Platform: ${game.platformgeneral}
</div>

<div class="info">
Completed: ${game.numberoftimecompleated} times
</div>

<div class="stars">
${stars}
</div>

<div class="review">
"${game.review}"
</div>

`;

container.appendChild(card);

}

}catch(error){

console.log(error);

showToast("Failed to load games");

}

}

loadGames();


/* NAVIGATION */

function goHome(){

window.location.href="/homepage/homepage.html";

}

function goAddGame(){

window.location.href="/addgamesplayed/addgames.html";

}