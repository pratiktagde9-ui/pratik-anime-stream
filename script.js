const seriesData=["ONE PIECE","Mushoku Tensei: Jobless","RE:ZERO - Starting Life","Daemons of the Shadow","That Time I Got Reincarnated"];
const movieData=["Ginga Tetsudou 999 Movie","Title to be Announced","JUNK END","Solo Leveling: Beyond the System","KING OF PRISM"];
function makeCards(list,id){const box=document.getElementById(id);if(!box)return;box.innerHTML=list.map((x,i)=>`<article class="poster"><span>${x}</span></article>`).join("")}
function focusSearch(){document.getElementById("searchInput").focus()}
function searchCards(){const q=document.getElementById("searchInput").value.toLowerCase();document.querySelectorAll(".poster").forEach(c=>{c.style.display=c.innerText.toLowerCase().includes(q)?"block":q?"none":"block"})}
function clearHistory(){document.getElementById("historyGrid").innerHTML="Your watch history will appear here."}
makeCards(seriesData,"series");makeCards(movieData,"movies");