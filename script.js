const historyBox=document.getElementById('history');const empty=document.getElementById('empty');const clear=document.getElementById('clear');const form=document.getElementById('searchForm');const input=document.getElementById('searchInput');let items=JSON.parse(localStorage.getItem('pratikHistory')||'[]');

function render(){historyBox.innerHTML='';empty.style.display=items.length?'none':'block';items.forEach(x=>{const c=document.createElement('article');c.className='poster';c.innerHTML=`<img src="${x.image}" alt=""><span>${x.title}</span>`;historyBox.appendChild(c)})}
function add(title,image){items=[{title,image},...items.filter(x=>x.title!==title)].slice(0,8);localStorage.setItem('pratikHistory',JSON.stringify(items));render()}
document.querySelectorAll('.q').forEach(card=>card.addEventListener('click',e=>{e.preventDefault();add(card.dataset.title,card.querySelector('img').src);}));
document.querySelectorAll('.poster').forEach(card=>card.addEventListener('click',()=>{const img=card.querySelector('img');const title=card.querySelector('span');if(img&&title)add(title.textContent.trim(),img.src)}));
form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(q)alert('Search: '+q);});
clear.addEventListener('click',()=>{items=[];localStorage.removeItem('pratikHistory');render()});
render();