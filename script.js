/* ============ DEFAULT CONTENT (edit here or use the Edit panel at yoursite/#edit) ============ */
const DEF={
 colors:{ink:"#111111",pink:"#f4c4d0",gray:"#d9d9d9",rose:"#d9a7a4"},
 hero:{title:"HELLO, WELCOME!",text:"Simple and clean designs. This portfolio showcases my works and skills. Come and explore what's inside!"},
 about:{text:"I am a BSIT student who loves technology and designing. I am passionate about creating clean designs and working projects. I may be shy at first, but I'm willing to communicate when it comes to important matters. I am dependable, kind, and someone you can talk to seriously. I take my academics seriously and I love creating and thinking of new ideas.",name:"Irene Mae P. Dimasacupan",photo:"assets/photo.jpg"},
 skills:[
  {title:"Skills 1",desc:"Video editing with CapCut: cuts, transitions, captions and effects.",img:"assets/skill1.jpg",video:""},
  {title:"Skills 2",desc:"Photography and photo editing.",img:"assets/skill2.jpg",video:""},
  {title:"Skills 3",desc:"Planning, note-taking and turning ideas into projects.",img:"assets/skill3.jpg",video:""},
  {title:"Preview",desc:"A preview of my edited work and presentations.",img:"assets/preview.jpg",video:""}],
 contact:{note:"If you have any questions, concerns, or ideas you'd like to share, just message me."},
 social:{fb:"https://www.facebook.com/YOUR_PROFILE",ig:"https://www.instagram.com/YOUR_PROFILE",mail:"YOUR_EMAIL@gmail.com"},
 /* Online inbox: create a free form at formspree.io (use your Gmail) and paste its URL here */
 formEndpoint:"https://formspree.io/f/YOUR_FORM_ID"
};
const $=s=>document.querySelector(s);
let CFG=structuredClone(DEF);
const merge=(a,b)=>{for(const k in b){if(b[k]&&typeof b[k]==="object"&&!Array.isArray(b[k]))merge(a[k]??={},b[k]);else a[k]=b[k]}};

/* ---- render everything from CFG ---- */
function render(){
 const r=document.documentElement.style;for(const k in CFG.colors)r.setProperty("--"+k,CFG.colors[k]);
 $("#hTitle").textContent=CFG.hero.title;$("#hText").textContent=CFG.hero.text;
 $("#aText").textContent=CFG.about.text;$("#aName").textContent=CFG.about.name;
 $("#aPhoto").src=CFG.about.photo;
 $("#cNote").textContent=CFG.contact.note;
 $("#sFb").href=CFG.social.fb;$("#sIg").href=CFG.social.ig;$("#sGm").href="mailto:"+CFG.social.mail;
 const ul=$("#cards");ul.innerHTML="";
 CFG.skills.forEach((s,i)=>{const li=document.createElement("li"),b=document.createElement("button");b.className="card";b.dataset.i=i;b.setAttribute("aria-label","Open "+s.title);
  const th=document.createElement("div");th.className="th";
  if(s.img){const im=new Image();im.alt="";im.loading="lazy";im.src=s.img;im.onerror=()=>im.remove();th.append(im)}
  th.append(document.createElement("i"));
  const t=document.createElement("b");t.textContent=s.title;const d=document.createElement("span");d.className="sr";d.textContent=s.desc;
  b.append(th,t,d);li.append(b);ul.append(li)});
}
async function load(){
 try{const r=await fetch("site-config.json");if(r.ok)merge(CFG,await r.json())}catch(e){}   // published settings
 try{const l=localStorage.getItem("portfolioCfg");if(l)merge(CFG,JSON.parse(l))}catch(e){}   // your saved edits
 render();
}
load();

/* ---- nav, active link, fade-in ---- */
$("#burger").onclick=e=>{const o=$("#nav").classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",o)};
$("#nav").onclick=e=>{if(e.target.matches("a")){$("#nav").classList.remove("open");$("#burger").setAttribute("aria-expanded",false)}};
const links=[...document.querySelectorAll(".pill")];
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle("on",a.hash==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
const fade=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");fade.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll("main section").forEach(s=>{spy.observe(s);fade.observe(s)});

/* ---- search: jumps to the section that contains the text ---- */
let tm;$("#q").addEventListener("input",()=>{clearTimeout(tm);tm=setTimeout(()=>{
 const q=$("#q").value.trim().toLowerCase(),n=$("#none");n.style.display="none";if(q.length<2)return;
 const hit=[...document.querySelectorAll("main section")].find(s=>s.textContent.toLowerCase().includes(q));
 hit?hit.scrollIntoView({behavior:"smooth"}):n.style.display="block"},300)});

/* ---- skill modal ---- */
const md=$("#md");
$("#cards").addEventListener("click",e=>{const b=e.target.closest(".card");if(!b)return;const s=CFG.skills[b.dataset.i],m=$("#mm");m.innerHTML="";
 const fail=()=>m.innerHTML='<div class="nm">Preview coming soon</div>';
 if(s.video){const v=document.createElement("video");v.src=s.video;v.controls=true;v.onerror=fail;m.append(v)}
 else if(s.img){const im=new Image();im.src=s.img;im.alt=s.title;im.onerror=fail;m.append(im)}else fail();
 $("#mt").textContent=s.title;$("#mp").textContent=s.desc;md.showModal()});
const stop=()=>{md.querySelector("video")?.pause()};
$("#mx").onclick=()=>md.close();md.addEventListener("click",e=>{if(e.target===md)md.close()});md.addEventListener("close",stop);

/* ---- contact form -> Formspree inbox ---- */
const f=$("#cf");
f.addEventListener("submit",async e=>{e.preventDefault();const st=$("#st");st.className="";st.textContent="";
 const em=f.email.value.trim(),ms=f.message.value.trim();let ok=true;
 const err=(i,el,t)=>{$(i).textContent=t;el.setAttribute("aria-invalid",!!t);if(t)ok=false};
 err("#e1",f.email,!em?"Please enter your email.":/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)?"":"That email doesn't look right. Example: name@gmail.com");
 err("#e2",f.message,!ms?"Please write a message.":ms.length<10?"Message needs at least 10 characters.":"");
 if(!ok||f._gotcha.value)return;
 const b=$("#send");b.disabled=true;b.textContent="Sending...";
 try{const r=await fetch(CFG.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({email:em,message:ms})});
  if(!r.ok)throw 0;f.reset();st.className="ok";st.textContent="Message sent. Thank you!"}
 catch{st.className="bad";st.textContent="Couldn't send. Please check your connection and try again."}
 b.disabled=false;b.textContent="Send"});

/* ---- Edit panel: only appears at yoursite/#edit ---- */
const panel=$("#panel"),gear=$("#gear");
function getP(p){return p.split(".").reduce((o,k)=>o[k],CFG)}
function setP(p,v){const k=p.split(".");const last=k.pop();k.reduce((o,x)=>o[x],CFG)[last]=v}
function fld(label,path,type){
 const id="f"+path.replace(/\./g,"_");
 if(type==="color")return `<label>${label}<input type="color" data-p="${path}" value="${getP(path)}"></label>`;
 if(type==="file")return `<label>${label} (upload)<input type="file" accept="image/*" data-f="${path}"></label>`;
 if(type==="area")return `<label>${label}<textarea rows="4" data-p="${path}">${getP(path)}</textarea></label>`;
 return `<label>${label}<input type="text" data-p="${path}" value="${getP(path).replace(/"/g,"&quot;")}"></label>`}
function buildPanel(){
 let h='<h2>Edit site</h2><p>Changes show live. Save keeps them in this browser. Download settings, then upload site-config.json next to index.html to publish them.</p><h4>Colors</h4>';
 [["Text and shapes","colors.ink"],["Accent (pink)","colors.pink"],["Buttons and cards","colors.gray"],["Page background","colors.rose"]].forEach(a=>h+=fld(a[0],a[1],"color"));
 h+='<h4>Home</h4>'+fld("Heading","hero.title")+fld("Intro","hero.text","area");
 h+='<h4>About</h4>'+fld("About text","about.text","area")+fld("Name","about.name")+fld("Photo","about.photo","file");
 CFG.skills.forEach((s,i)=>h+=`<h4>Skill card ${i+1}</h4>`+fld("Title",`skills.${i}.title`)+fld("Description",`skills.${i}.desc`,"area")+fld("Image",`skills.${i}.img`,"file")+fld("Video file or link",`skills.${i}.video`));
 h+='<h4>Contact</h4>'+fld("Short message","contact.note","area")+fld("Facebook link","social.fb")+fld("Instagram link","social.ig")+fld("Gmail address","social.mail")+fld("Formspree URL (online inbox)","formEndpoint");
 h+='<div class="row"><button id="sv">Save</button><button class="g" id="dl">Download settings</button><button class="g" id="rs">Reset</button><button class="g" id="cl">Close</button></div>';
 panel.innerHTML=h}
panel.addEventListener("input",e=>{const p=e.target.dataset.p;if(p){setP(p,e.target.value);render()}});
panel.addEventListener("change",e=>{const p=e.target.dataset.f;if(!p||!e.target.files[0])return;
 const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement("canvas"),k=Math.min(1,900/Math.max(im.width,im.height));
  c.width=im.width*k;c.height=im.height*k;c.getContext("2d").drawImage(im,0,0,c.width,c.height);setP(p,c.toDataURL("image/jpeg",.82));render()};im.src=rd.result};rd.readAsDataURL(e.target.files[0])});
panel.addEventListener("click",e=>{
 if(e.target.id==="sv"){try{localStorage.setItem("portfolioCfg",JSON.stringify(CFG));alert("Saved in this browser.")}catch{alert("Not saved: images are too large. Use smaller photos.")}}
 if(e.target.id==="dl"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(CFG,null,1)],{type:"application/json"}));a.download="site-config.json";a.click()}
 if(e.target.id==="rs"&&confirm("Reset everything to the original content?")){localStorage.removeItem("portfolioCfg");CFG=structuredClone(DEF);render();buildPanel()}
 if(e.target.id==="cl")panel.classList.remove("open")});
function checkEdit(){if(location.hash==="#edit")sessionStorage.setItem("edit","1");gear.style.display=sessionStorage.getItem("edit")?"block":"none"}
gear.onclick=()=>{buildPanel();panel.classList.add("open")};
addEventListener("hashchange",checkEdit);checkEdit();