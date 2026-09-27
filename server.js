// Serveur sécurisé UCL Scores
// Node.js 18+ recommandé. La clé API reste dans .env et n'est jamais envoyée au navigateur.
require("dotenv").config();
const express=require("express");
const path=require("path");
const app=express();
const PORT=process.env.PORT||3000;
const API="https://api.football-data.org/v4";
const TOKEN=process.env.FOOTBALL_DATA_TOKEN;
if(!TOKEN) console.warn("ATTENTION: FOOTBALL_DATA_TOKEN n'est pas configuré.");

app.use(express.static(path.join(__dirname,"public")));
async function api(pathname){
 const r=await fetch(API+pathname,{headers:{"X-Auth-Token":TOKEN}});
 if(!r.ok){const text=await r.text(); throw new Error(`football-data.org: ${r.status} ${text}`);}
 return r.json();
}
app.get("/api/matches",async(req,res)=>{
 try{
   // CL = UEFA Champions League dans football-data.org
   const data=await api("/competitions/CL/matches?status=SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED");
   res.json(data);
 }catch(e){res.status(502).json({error:"Erreur API football-data.org"});}
});
app.get("/api/standings",async(req,res)=>{
 try{res.json(await api("/competitions/CL/standings"));}catch(e){res.status(502).json({error:"Classement indisponible"});}
});
app.get("/api/health",(req,res)=>res.json({ok:true}));
app.listen(PORT,()=>console.log(`UCL Scores: http://localhost:${PORT}`));
