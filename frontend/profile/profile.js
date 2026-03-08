function goHome(){
window.location.href="http://localhost:3000/homepage/homepage.html";
}

const viewer = localStorage.getItem("username")

function getUsernameFromURL(){
const params=new URLSearchParams(window.location.search);
return params.get("username");
}


/* ================= RANK SYSTEM ================= */

const ranks = [

{title:"Rookie",icon:"🥉",class:"rank-rookie",min:0,max:4},

{title:"Apprentice",icon:"🥈",class:"rank-apprentice",min:5,max:14},

{title:"Warrior",icon:"⚔️",class:"rank-warrior",min:15,max:29},

{title:"Champion",icon:"🏆",class:"rank-champion",min:30,max:59},

{title:"Elite Gamer",icon:"🔥",class:"rank-elite",min:60,max:99},

{title:"Legend",icon:"👑",class:"rank-legend",min:100,max:999999}

];


function getPlayerRank(games){

for(let r of ranks){

if(games >= r.min && games <= r.max){
return r;
}

}

}


/* ================= PROFILE LOAD ================= */

async function loadProfile(){

const profileUsername=getUsernameFromURL();
const loggedUser=localStorage.getItem("username");

const res=await fetch(`http://localhost:3000/api/${profileUsername}?viewer=${viewer}`);
const data=await res.json();

const user=data.channel;


/* NAVBAR */

document.getElementById("navUsername").textContent=loggedUser;
document.getElementById("navAvatar").src=user.avatar;


/* PROFILE */

document.getElementById("profileAvatar").src=user.avatar;
document.getElementById("profileUsername").textContent=user.username;
document.getElementById("profileFullname").textContent=user.fullname;


/* STATS */

document.getElementById("gamesCount").textContent=user.numofgamesplayed;
document.getElementById("followersCount").textContent=user.followerscount;
document.getElementById("followingCount").textContent=user.following;


/* ================= RANK SYSTEM ================= */

const gamesPlayed = user.numofgamesplayed;

const rank = getPlayerRank(gamesPlayed);

document.getElementById("avatarRing").classList.add(rank.class);

document.getElementById("rankBadge").textContent =
`${rank.icon} ${rank.title}`;

document.getElementById("gamesBadge").textContent =
`🔥 ${gamesPlayed} Games Played`;


/* ================= PROGRESS SYSTEM ================= */

const nextRank = ranks[ranks.indexOf(rank)+1];

if(nextRank){

const progress =
((gamesPlayed - rank.min) /
(nextRank.min - rank.min)) * 100;

document.getElementById("rankProgress").style.width =
progress + "%";

document.getElementById("nextRankText").textContent =
`Next Rank → ${nextRank.title}`;

}else{

document.getElementById("rankProgress").style.width = "100%";
document.getElementById("nextRankText").textContent =
"Maximum Rank Achieved";

}


/* ================= FOLLOW BUTTON ================= */

const followBtn = document.getElementById("followBtn");

if (user.isfollowed) {
  followBtn.textContent = "Followed";
  followBtn.disabled = true;
} else {
  followBtn.textContent = "Follow";
}

followBtn.onclick = async () => {

const response = await fetch(
`http://localhost:3000/api/${profileUsername}/follow`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username:loggedUser
})
});

if(response.status === 200){

followBtn.textContent="Followed";
followBtn.disabled=true;

}

};


/* ================= POSTS ================= */

loadPosts(profileUsername);

}


/* ================= POSTS ================= */

async function loadPosts(username){

const res=await fetch(`http://localhost:3000/api/${username}/posts`);
const data=await res.json();

const posts=data.posts.posts;

const container=document.getElementById("postsContainer");

container.innerHTML="";

posts.forEach(post=>{

let images="";

if(Array.isArray(post.postcontent)){
images=post.postcontent.map(img=>`<img src="${img}" class="post-img">`).join("");
}else{
images=`<img src="${post.postcontent}" class="post-img">`;
}

const card=document.createElement("div");

card.className="post-card";

card.innerHTML=`
<h3>${post.tittle}</h3>
${images}
`;

container.appendChild(card);

});

}


loadProfile();