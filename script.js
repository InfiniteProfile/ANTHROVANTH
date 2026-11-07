"use strict";
const $=id=>document.getElementById(id),dec=(d,k)=>d.rows.map(r=>Object.fromEntries(d.cols.split(",").map((c,i)=>[c,r[i]])));
let SP,PR,CH,cache=new Map,cfg={};
function hashSeed(s){let a=1779033703,b=3144134277,c=1013904242,d=2773480762;for(let i=0;i<s.length;i++){const k=s.charCodeAt(i);a=b^Math.imul(a^k,597399067);b=c^Math.imul(b^k,2869860233);c=d^Math.imul(c^k,951274213);d=a^Math.imul(d^k,2716044179)}
a=Math.imul(c^a>>>18,597399067);b=Math.imul(d^b>>>22,2869860233);c=Math.imul(a^c>>>17,951274213);d=Math.imul(b^d>>>19,2716044179);return[(a^b^c^d)>>>0,(b^a)>>>0,(c^a)>>>0,(d^a)>>>0]}
function rng(s){let[a,b,c,d]=s;return()=>{a>>>=0;b>>>=0;c>>>=0;d>>>=0;let t=(a+b|0)+d|0;d=d+1|0;a=b^b>>>9;b=c+(c<<3)|0;c=c<<21|c>>>11;c=c+t|0;return(t>>>0)/4294967296}}
const S1=["ka","re","um","do","na","shi","ba","lo","te","mu","ar","gi","zo","he","ob"],S2=["n","r","k","m","l","s","th"];
function name(r){let n="";for(let i=0,l=2+(r()*2|0);i<l;i++)n+=S1[r()*S1.length|0];return n[0].toUpperCase()+n.slice(1)+S2[r()*S2.length|0]}
const pick=(r,a)=>a[r()*a.length|0],ri=(r,a,b)=>a+Math.floor(r()*(b-a+1)),rd=(n,p)=>Math.round(n/p)*p;
const period=bp=>CH.periods.find(p=>bp<=p[1]&&bp>p[2])||CH.periods[4];
const cls=(a,s)=>a<3?"infant":a<s.adult*.6?"child":a<s.adult?"adolescent":a>s.maxLife*.7?"elder":"adult";
function gen(id){let p=cache.get(id);if(p)return p;const r=rng(hashSeed("ANTH:"+id)),s=SP[r()*SP.length|0],pr=1e3;
const life=Math.max(2,Math.round(s.maxLife*(.08+.92*Math.pow(r(),1.4)))),pad=s.from-60,lo=s.to+life;
const birth=rd(lo+r()*(pad-lo),10)+0,b=Math.min(Math.max(birth,lo),pad),death=b-life,age=life,ac=cls(age,s);
const rk=pick(r,s.regions.split(",")),R=CH.regions[rk],hab=pick(r,R[2]),H=CH.habitats[hab],per=period(Math.round((b+death)/2));
const jobs=PR.filter(j=>j.ages.includes(ac)&&(!j.tools||s.tools)&&(!j.fire||s.fire)),job=pick(r,jobs),sec=pick(r,jobs.filter(j=>j!==job&&j.name!==PR[0].name)||jobs);
const h=ac==="infant"?ri(r,45,60):Math.round((s.h0+r()*(s.h1-s.h0))*(ac==="child"?.65:ac==="adolescent"?.88:1)),m=Math.round((s.m0+r()*(s.m1-s.m0))*(ac==="infant"?.12:ac==="child"?.45:ac==="adolescent"?.8:1));
const sib=ri(r,0,3),kids=age>=s.adult+6&&b-s.adult-8>=s.to?ri(r,0,2):0,pb=b+ri(r,18,35),mb=b+ri(r,18,35);
p={id,name:name(r),sp:s,rk,region:R[0],cont:R[1],hab,H,per,b,death,life,age,ac,job,sec:sec||job,h,m,h0:s.h0,sib,kids,
par:[[name(r),pb],[name(r),mb]],sibs:Array.from({length:sib},()=>[name(r),b+ri(r,-6,6)]),ch:Array.from({length:kids},()=>[name(r),b-s.adult-ri(r,2,8)]),seed:hashSeed("IMG:"+id),
tone:ri(r,0,25)};cache.size>5000&&cache.clear();cache.set(id,p);return p}
function face(p){const[br,jw,pg,cr]=p.sp.skull.split(",").map(Number),t=p.tone,sk=`hsl(28,${28+t/2}%,${24+t}%)`,j=jw*8,e=p.ac==="infant"?3:0;
return`<svg viewBox="0 0 100 120" role="img" aria-label="Illustrative reconstruction of ${p.sp.name}"><rect width="100" height="120" fill="${p.H[2]}"/>
<ellipse cx="50" cy="${48-cr*6}" rx="${26+e}" ry="${24+cr*14}" fill="${sk}"/><path d="M${28-j/2},70 Q50,${112+j} ${72+j/2},70 L${70+j/2},${94+pg*6} Q50,${108+j} ${30-j/2},${94+pg*6}Z" fill="${sk}"/>
<ellipse cx="50" cy="${84+pg*4}" rx="${10+pg*8}" ry="${8+pg*5}" fill="rgba(0,0,0,.15)"/>
<rect x="30" y="${50-br*2}" width="40" height="${3+br*7}" rx="3" fill="rgba(0,0,0,.45)"/><circle cx="39" cy="${58}" r="2.4" fill="#120e08"/><circle cx="61" cy="58" r="2.4" fill="#120e08"/>
<path d="M47,62 L45,76 Q50,${80+pg*3} 55,76 L53,62Z" fill="rgba(0,0,0,.2)"/><rect x="${42-pg*2}" y="${86+pg*4}" width="${16+pg*4}" height="2" rx="1" fill="#120e08"/>
${p.sp.name.startsWith("Paranthropus")?'<rect x="47" y="18" width="6" height="18" fill="rgba(0,0,0,.4)"/>':""}${p.sp.tools?"":'<path d="M24,40 Q50,6 76,40" fill="none" stroke="#1a120a" stroke-width="5" opacity=".5"/>'}</svg>`}
const fmt=n=>n.toLocaleString("en-US"),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function card(p){return`<article class="card" tabindex="0" data-id="${p.id}">${face(p)}<div><h3>${esc(p.name)}</h3><p>${p.sp.name} (${p.sp.status})</p><p class="oc">${p.job.name}, about ${p.age} yr</p><p>${esc(p.region)}</p><p>${p.per[0]}, ${fmt(p.b)} BP</p><p class="id">ID ${p.id}</p></div></article>`}
function valid(p){return p.b>p.death&&p.b-p.death===p.life&&p.b<=p.sp.from&&p.death>=p.sp.to&&p.h>=40&&p.job.ages.includes(p.ac)&&p.par.every(x=>x[1]>p.b&&x[1]<=p.sp.from)}
function detail(p){const L=a=>a.length?a.map(x=>`${x[0]} (b. ${fmt(x[1])} BP)`).join("; "):"None recorded",u=Math.max(10,Math.round(p.sp.from-p.sp.to>2e5?5e3:1e3));
$("dc").innerHTML=`${face(p)}<h2>${esc(p.name)}</h2><p class="id">ID ${p.id}</p><p>${p.sp.name}, ${p.sp.status}. Profile type: scientifically reconstructed fictional individual.</p><p><i>Scientific reconstruction of a fictional individual. Illustrative reconstruction based on available scientific evidence, not a photograph.</i></p>
<h4>Chronology</h4><p>Birth about ${fmt(p.b)} BP, death about ${fmt(p.death)} BP (uncertainty about ${fmt(u)} years). Lifespan = ${fmt(p.b)} - ${fmt(p.death)} = ${p.life} years. ${p.per[0]}: ${p.per[3]}.</p>
<h4>Biology</h4><p>Height about ${p.h} cm, mass about ${p.m} kg (estimated). ${p.sp.face}. Locomotion: ${p.sp.loco}.</p>
<h4>Occupation</h4><p>${p.job.name} (${p.ac}). ${p.job.note}. Secondary: ${p.sec.name}. Skills: ${p.job.skills}.</p>
<h4>Environment</h4><p>${esc(p.region)}, ${p.cont}. Habitat: ${p.hab}. Terrain: ${p.H[0]}. Resources: ${p.H[1]}.</p>
<h4>Social life (hypothetical)</h4><p>Parents: ${L(p.par)}. Siblings: ${L(p.sibs)}. Children: ${L(p.ch)}. Small mobile group; no cultural practices are asserted.</p>
<h4>Scientific information</h4><p>Species range ${fmt(p.sp.from)} to ${fmt(p.sp.to)} BP. Classification: ${p.sp.status}. Not a real fossil individual; species facts come from published fossil evidence, all personal details are invented.</p>`;$("dlg").showModal()}
const F={};function match(p){return(!F.s||p.sp.name===F.s)&&(!F.j||p.job.name===F.j)&&(!F.c||p.per[0]===F.c)&&(!F.r||p.rk===F.r)}
let next=1n,gen_=0,busy=false,sent=document.createElement("i"),io;
function fill(n){if(busy)return;busy=true;const tk=gen_,frag=[];let found=0,scans=0;(function step(){if(tk!==gen_)return;let c=0;
while(found<n&&c<1500&&scans<4e5){const p=gen(next.toString());next++;c++;scans++;if(!valid(p))continue;if(match(p)){frag.push(card(p));found++}}
if(found<n&&scans<4e5)return setTimeout(step,0);const d=document.createElement("div");d.innerHTML=frag.join("");const f=$("feed");while(d.firstChild)f.appendChild(d.firstChild);
if(!found&&!f.children.length)$("msg").textContent="No matching individuals. Species, period and region may not overlap.";
const k=f.querySelectorAll(".card"),ix=Math.max(0,k.length-100);if(k.length)f.insertBefore(sent,k[ix]);io&&(io.unobserve(sent),io.observe(sent));busy=false;chk()})()}
function chk(){if(!busy&&sent.isConnected&&sent.getBoundingClientRect().top<innerHeight+800)fill(300)}
function reset(start){gen_++;busy=false;$("feed").textContent="";$("msg").textContent="";next=BigInt(start);fill(300)}
function opts(el,label,list){el.innerHTML=`<option value="">${label}</option>`+list.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join("")}
async function init(){const j=u=>fetch(u).then(r=>r.json());[SP,PR,CH]=await Promise.all([j("species.json"),j("professions.json"),j("chronology.json")]);
SP=dec(SP);PR=dec(PR);PR.forEach(x=>x.ages=x.ages);
opts($("fs"),"All species",SP.map(s=>[s.name,s.name]));opts($("fp"),"All professions",PR.map(x=>[x.name,x.name]));opts($("fc"),"All periods",CH.periods.map(x=>[x[0],x[0]]));opts($("fr"),"All regions",Object.entries(CH.regions).map(([k,v])=>[k,v[0]]));
const onf=()=>{F.s=$("fs").value;F.j=$("fp").value;F.c=$("fc").value;F.r=$("fr").value;reset(next>0n&&F.start?F.start:1)};["fs","fp","fc","fr"].forEach(i=>$(i).onchange=()=>{F.start=0;onf()});
$("sf").onsubmit=e=>{e.preventDefault();const v=$("q").value.trim();if(!/^[1-9][0-9]*$/.test(v)){$("msg").textContent="Enter a whole number of 1 or more, digits only, no leading zero.";return}
F.s=F.j=F.c=F.r="";["fs","fp","fc","fr"].forEach(i=>$(i).value="");reset(v);window.scrollTo(0,0);detail(gen(v))};
$("clr").onclick=()=>{$("q").value="";$("msg").textContent="";reset(1);$("q").focus()};
$("feed").onclick=e=>{const c=e.target.closest(".card");c&&detail(gen(c.dataset.id))};$("feed").onkeydown=e=>{if(e.key==="Enter"){const c=e.target.closest(".card");c&&detail(gen(c.dataset.id))}};
$("x").onclick=()=>$("dlg").close();
if("IntersectionObserver"in window)io=new IntersectionObserver(en=>{en[0].isIntersecting&&!busy&&fill(300)},{rootMargin:"800px"});
addEventListener("scroll",chk,{passive:true});setInterval(chk,1500);reset(1)}
init();
