let allMatches=[], currentFilter="all";
const $=s=>document.querySelector(s);
function typeOf(m){const s=m.status||""; if(["LIVE","IN_PLAY","PAUSED","1H","2H"].includes(s))return"live"; if(["FINISHED","AWARDED"].includes(s))return"finished"; return"upcoming"}
function formatDate(iso){return new Date(iso).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"})}
function render(){
 const q=$("#search").value.toLowerCase().trim();
 const list=allMatches.filter(m=>{const t=typeOf(m);return(currentFilter==="all"||t===currentFilter)&&(!q||(m.homeTeam.name+" "+m.awayTeam.name).toLowerCase().includes(q))});
 if(!list.length){$("#matches").innerHTML='<div class="match"><div></div><div class="score">Aucun match trouvé</div><div></div></div>';return}
 let day="";
 $("#matches").innerHTML=list.map(m=>{
  const t=typeOf(m), d=formatDate(m.utcDate), heading=d!==day?`<div class="match-day">${d}</div>`:""; day=d;
  const hs=m.score?.fullTime?.home ?? m.score?.halfTime?.home ?? null, as=m.score?.fullTime?.away ?? m.score?.halfTime?.away ?? null;
  const status=t==="live"?"En direct":t==="finished"?"Terminé":new Date(m.utcDate).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
  return `${heading}<article class="match"><div class="team"><span class="badge">⚽</span>${m.homeTeam.name}</div><div class="score"><strong>${hs===null?"–":hs} <small>:</small> ${as===null?"–":as}</strong><div class="status ${t}">${status}</div></div><div class="team right">${m.awayTeam.name}<span class="badge">⚽</span></div></article>`;
 }).join("");
}
function renderTable(table){
 if(!table?.length){$("#table").innerHTML='<div class="loading">Classement indisponible pour cette compétition.</div>';return}
 $("#table").innerHTML=table.map((r,i)=>`<div class="row"><span>${i+1}</span><span class="club"><i class="mini">⚽</i>${r.team.name}</span><span>${r.playedGames??r.playedGames}</span><b>${r.points??0}</b></div>`).join("");
}
async function load(){
 $("#apiStatus").textContent="Connexion au serveur…"; $("#statusDot").parentElement.className="api-status";
 try{
  const [gamesRes,tableRes]=await Promise.all([fetch("/api/matches"),fetch("/api/standings")]);
  if(!gamesRes.ok)throw new Error("Impossible de récupérer les matchs");
  const games=await gamesRes.json(), table=tableRes.ok?await tableRes.json():[];
  allMatches=games.matches||[]; render(); renderTable(table.standings?.[0]?.table||table||[]);
  $("#apiStatus").textContent="API connectée"; $("#statusDot").parentElement.className="api-status ok";
  $("#lastUpdate").textContent="Dernière mise à jour : "+new Date().toLocaleTimeString("fr-FR");
 }catch(e){$("#apiStatus").textContent=e.message;$("#statusDot").parentElement.className="api-status error";$("#matches").innerHTML=`<div class="match"><div></div><div class="score">${e.message}</div><div></div></div>`}
}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentFilter=b.dataset.filter;render()});
$("#search").oninput=render; $("#refreshBtn").onclick=load; $("#themeBtn").onclick=()=>document.body.classList.toggle("light");
load(); setInterval(load,60000);
