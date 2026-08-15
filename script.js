const lists={
series:["Black Clover: Sword of the Wizard King","Pokémon: Arceus and the Jewel of Life","Metal Fight Beyblade","Pokémon Ranger and the Temple of Sea","One Piece","Mushoku Tensei: Jobless Reincarnation","Re:ZERO","Daemons of the Shadow Realm","That Time I Got Reincarnated as a Slime","Solo Leveling","Demon Slayer","Jujutsu Kaisen","Naruto","Bleach","Attack on Titan","My Hero Academia","Black Clover","Dragon Ball Super","Hunter x Hunter","Frieren"],
movies:["Pokémon: Arceus and the Jewel of Life","Metal Fight Beyblade","Pokémon Ranger","Pokémon: Secrets of the Jungle","A Silent Voice","Your Name","Demon Slayer: Mugen Train","Spirited Away","Jujutsu Kaisen 0","Weathering With You","Suzume","Howl's Moving Castle","The Boy and the Heron","Dragon Ball Super: Broly","One Piece Film Red","Naruto: The Last","Boruto Movie","Ponyo","Wolf Children","The Garden of Words"],
cartoons:["The Loud House Movie","Ben 10 vs. the Universe","Transformers Prime: The Movie","Doraemon","Shinchan","Tom and Jerry","Ninja Hattori","Kiteretsu","Perman","Oggy","Motu Patlu","Chhota Bheem","Scooby-Doo","Dragon Ball","Pokémon","Teen Titans","Mr. Bean","Power Rangers","Looney Tunes","Courage"]
};

const path=(type,i)=>`assets/posters/${type}/${String((i%20)+1).padStart(2,"0")}.svg`;

function cards(type,names){
 return names.map((n,i)=>`<article class="card" data-title="${n.toLowerCase()}">
 <img src="${path(type,i)}" alt="${n}" loading="lazy">
 <div class="title">${n}</div><div class="meta">${type==="series"?(i%3===0?"Ongoing":`${12+i%13} Episodes`):type==="movies"?"Movie":"Cartoon"}</div>
 </article>`).join("");
}
function render(){
 series.innerHTML=cards("series",lists.series);
 movies.innerHTML=cards("movies",lists.movies);
 cartoons.innerHTML=cards("cartoons",lists.cartoons);
 popular.innerHTML=cards("movies",lists.movies.slice(4).concat(lists.movies.slice(0,4)));
}
render();

const history=JSON.parse(localStorage.getItem("pratikHistory")||"[]");
if(history.length) historyText.textContent=history.join(" • ");
clear.onclick=()=>{localStorage.removeItem("pratikHistory");historyText.textContent="Your watch history will appear here.";};

function search(){
 const q=search.value.trim().toLowerCase();
 if(!q)return;
 document.querySelectorAll(".card").forEach(c=>c.style.display=c.dataset.title.includes(q)?"":"none");
}
searchBtn.onclick=search;
search.addEventListener("keydown",e=>{if(e.key==="Enter")search();});
