let selectedStars=0;

/* NAVBAR USER */

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


/* STAR RATING */

const stars=document.querySelectorAll("#starContainer span");

stars.forEach(star=>{

star.addEventListener("click",()=>{

selectedStars=star.dataset.value;

stars.forEach(s=>{

s.classList.remove("active");

if(s.dataset.value<=selectedStars){

s.classList.add("active");

}

});

});

});


/* TOAST */

function showToast(msg){

const toast=document.getElementById("toast");

toast.textContent=msg;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},3000);

}


/* SUBMIT */

document.getElementById("gameForm")

.addEventListener("submit",async(e)=>{

e.preventDefault();

const gamename=document.getElementById("gamename").value;

const tags=document.getElementById("gametags").value
.split(",")
.map(t=>t.trim());

const platform=document.getElementById("platform").value;

const completed=document.getElementById("completed").value;

const review=document.getElementById("review").value;

try{

const res=await fetch(

`http://localhost:3000/api/${username}/addgamesplayed`,

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

gametags:tags,
gamename:gamename,
numberoftimecompleated:completed,
platform:platform,
stars:selectedStars,
review:review

})

}

);

const data=await res.json();

showToast(data.reason || "Game added");

}catch{

showToast("Failed to add game");

}

});


/* HOME */

function goHome(){

window.location.href="/homepage/homepage.html";

}