const container = document.getElementById("recruitContainer");

const username = localStorage.getItem("username");

const RAWG_KEY = "d2baeb53430e46738e58026498e22258";

function goHome(){
  window.location.href="/homepage/homepage.html";
}


/* GET GAME LOGO FROM RAWG */

async function getGameLogo(gameName){

  try{

    const res = await fetch(
      `https://api.rawg.io/api/games?search=${gameName}&page_size=1&key=${RAWG_KEY}`
    );

    const data = await res.json();

    if(data.results && data.results.length > 0){
      return data.results[0].background_image;
    }

  }catch(err){
    console.log("logo fetch failed", err);
  }

  return "https://via.placeholder.com/70";
}


/* LOAD ALL RECRUITS */

async function loadRecruitments(){

  try{

    const res = await fetch(
      "http://localhost:3000/api/recruit/allrecruits"
    );

    const data = await res.json();

    const recruits = data.recruits;

    container.innerHTML = "";

    if(!recruits || recruits.length === 0){

      container.innerHTML = "<p>No recruit currently</p>";
      return;

    }

    for(const recruit of recruits){

      const logo = await getGameLogo(recruit.gamenamelower);

      const card = document.createElement("div");
      card.className = "recruit-card";

      card.innerHTML = `

      <div class="recruit-left">

        <img src="${logo}" class="game-logo" >

        <div class="recruit-info">

          <h3 >${recruit.gamenamelower}</h3>

          <p class="recruiter">

            <img src="${recruit.recruiter.avatar}" 
                 class="recruiter-avatar">

            <a href="/profile/profile.html?username=${recruit.recruiter.username}"
               class="recruiter-link">

              ${recruit.recruiter.username}

            </a>

          </p>

        <div class="recruit-stats">

<span class="stat platform">
🎮 ${recruit.platformgeneral}
</span>

<span class="stat players">
👥 ${recruit.applicant.length}/${recruit.numofplayer}
</span>

<span class="stat applicants">
📥 ${recruit.applicant.length} Applied
</span>

</div>

        </div>

      </div>

     <button class="apply-btn"
onclick="applyRecruit('${recruit._id}', this)">
Apply
</button>

      `;

      container.appendChild(card);

    }

  }catch(err){

    console.error("error loading recruits:", err);

  }

}

loadRecruitments();


/* APPLY FUNCTION */

async function applyRecruit(id, button){

  try{

    const res = await fetch(
      "http://localhost:3000/api/recruitment/apply",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          recruitment_id:id,
          username:localStorage.getItem("username")
        })
      }
    );

    const data = await res.json();

    if(res.status === 200){

      button.textContent = "Applied";
      button.classList.remove("apply-btn");
      button.classList.add("applied-btn");
      button.disabled = true;

    }

    if(data. message === "already applied"){

      button.textContent = "Applied";
      button.classList.remove("apply-btn");
      button.classList.add("applied-btn");
      button.disabled = true;

    }

  }catch(err){

    console.error(err);

  }

}


/* SEARCH RECRUITMENT */

async function searchRecruit(){

  const game = document
    .getElementById("gameSearch")
    .value
    .trim();

  if(!game){
    loadRecruitments();
    return;
  }

  try{

    const res = await fetch(
      "http://localhost:3000/api/recruit/allrecruits",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          gamename: game
        })
      }
    );

    const data = await res.json();

    const recruits = data.recruits;

    const container = document.getElementById("recruitContainer");
    container.innerHTML = "";

    if(!recruits || recruits.length === 0){
      container.innerHTML = "<p>No recruit currently</p>";
      return;
    }

    for(const recruit of recruits){

      const logo = await getGameLogo(recruit.gamenamelower);

      const card = document.createElement("div");
      card.className = "recruit-card";

      card.innerHTML = `
      <div class="recruit-left">

        <img src="${logo}" class="game-logo">

        <div class="recruit-info">

          <h3>${recruit.gamenamelower}</h3>

          <p class="recruiter">

            <img src="${recruit.recruiter.avatar}" class="recruiter-avatar">

            <a href="/profile/profile.html?username=${recruit.recruiter.username}">
              ${recruit.recruiter.username}
            </a>

          </p>

         <div class="recruit-stats">

<span class="stat platform">
🎮 ${recruit.platformgeneral}
</span>

<span class="stat players">
👥 ${recruit.applicant.length}/${recruit.numofplayer}
</span>

<span class="stat applicants">
📥 ${recruit.applicant.length} Applied
</span>

</div>

        </div>

      </div>

    <button class="apply-btn"
onclick="applyRecruit('${recruit._id}', this)">
Apply
</button>
      `;

      container.appendChild(card);

    }

  }catch(err){
    console.error("Search error:", err);
  }

}