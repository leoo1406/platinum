/* ============================================================
   OBRA — o edifício sendo construído, em elevação.
   O traço do prédio é o desenho original (img/obra/torre-traco.webp,
   gerado a partir da elevação enviada, sem nenhuma alteração de
   geometria): a animação só revela esse desenho de baixo para cima,
   laje por laje. No fim, a câmera entra em um pavimento e a planta
   tipo é desenhada em linhas (js/planta.js), com o botão "Imagem real".

   Tudo é função do tempo t (draw(t)): dá para pular para qualquer
   ponto e o quadro fica idêntico.
   ============================================================ */
(()=>{
const root = document.getElementById('obra');
if(!root) return;

/* ---------- ajustes rápidos ---------- */
const DUR     = 38;     // duração total (s)
const FLOORS  = 44;     // pavimentos da torre
const FLOOR   = 32;     // pavimento em que a câmera entra
/* cotas do desenho original, em px da imagem (298 x 833) */
const IMG_W=298, IMG_H=833;
const Y_BASE   = 825;   // fundo do desenho (abaixo do solo)
const Y_GROUND = 812.5; // linha do terreno
const Y_PODIUM = 710;   // topo do embasamento = piso do 1º pavimento
const Y_TOWER  = 134;   // laje de coroamento
const Y_CROWN  = 25;    // ponta do coroamento

/* capítulos: [início(s), nome, descrição] — os tempos abaixo mandam em tudo */
const PH = [
  [0,    'Terreno',        'Marcação no lote'],
  [2.4,  'Fundação',       'Estacas abaixo da cota zero'],
  [4.6,  'Embasamento',    'A base do edifício'],
  [7.4,  'Torre',          '44 pavimentos, um de cada vez'],
  [21,   'Coroamento',     'O remate curvo no topo'],
  [23.4, 'Luz',            'O prédio acende pela primeira vez'],
  [25.6, 'Penthouse',      'A câmera entra no pavimento 44'],
  [28.4, 'Planta',         'A planta da Penthouse desenhada'],
];
const T_TOWER0=7.4, T_TOWER1=21;

const RED='#D0BFAB', RED_LT='#E2DCD0';   /* areia e linho da paleta */
const pw = a => `rgba(242,239,232,${a})`;   /* creme */
const rw = a => `rgba(208,191,171,${a})`;   /* areia */
const cl = (v,a=0,b=1) => v<a?a:v>b?b:v;
const ss = (a,b,t) => { const x=cl((t-a)/(b-a)); return x*x*(3-2*x); };
const eio = x => x<.5 ? 4*x*x*x : 1-Math.pow(-2*x+2,3)/2;
const lerp = (a,b,k) => a+(b-a)*k;
const rnd = (a,b=0) => { const h=Math.sin(a*127.1+b*311.7)*43758.5453; return h-Math.floor(h); };

/* largura construída do desenho a cada 2 px (x mínimo, x máximo) */
const EXT=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,94,95,94,96,94,96,94,97,94,98,94,99,94,100,94,101,94,102,94,103,94,105,94,106,94,107,94,108,94,110,94,111,94,113,94,114,94,115,94,117,94,119,94,120,94,122,94,124,94,126,94,128,94,130,94,132,94,134,94,137,94,143,94,149,94,150,94,150,94,150,94,150,94,151,94,155,94,158,94,161,94,164,94,167,91,169,94,172,94,174,94,176,94,178,90,180,90,182,90,183,94,185,94,186,94,188,94,189,94,196,90,196,90,196,91,196,94,196,94,196,94,196,94,196,94,196,94,196,90,196,90,196,90,196,94,196,94,196,94,196,94,196,94,196,91,196,90,196,90,196,90,196,94,196,94,196,94,196,94,196,94,196,90,196,90,196,90,196,90,196,94,196,94,196,94,196,94,196,94,196,94,196,90,196,90,196,90,196,94,196,94,196,94,196,94,196,94,196,94,196,90,196,90,196,90,196,94,196,94,196,94,196,94,196,94,196,94,196,90,196,90,196,90,196,94,196,94,196,94,196,94,196,94,196,94,196,90,196,90,196,90,196,94,196,94,196,94,196,94,196,94,196,94,196,90,196,90,196,90,196,94,196,94,196,94,196,94,196,94,196,94,196,90,196,90,196,90,196,94,196,94,196,94,196,94,196,94,196,94,196,90,196,90,196,90,196,94,196,94,196,94,196,94,196,94,196,94,196,78,196,77,196,77,196,77,196,77,196,77,196,77,196,77,196,77,196,77,196,77,196,77,196,77,196,77,196,77,197,77,197,77,197,77,197,77,197,77,197,77,197,77,197,77,197,77,197,77,197,77,197,77,198,77,198,77,198,77,198,77,198,77,198,77,198,77,198,77,198,77,199,77,199,77,199,77,199,77,199,77,199,77,199,77,200,77,200,77,200,77,200,77,200,77,200,77,201,77,201,77,201,77,201,77,201,77,202,77,202,77,202,77,202,77,202,77,203,77,203,77,203,77,203,77,204,77,204,77,204,77,204,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,205,77,204,77,204,77,204,77,204,77,204,77,204,77,204,77,204,77,204,77,204,77,204,77,204,77,204,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,204,77,204,77,204,77,204,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,204,77,204,77,204,77,204,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,204,77,204,77,204,77,204,77,204,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,204,77,204,77,204,77,204,77,204,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,204,77,204,77,204,77,204,77,204,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,203,77,212,34,212,34,212,34,212,34,212,34,212,34,212,34,212,34,287,34,287,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,290,34,282,34,282,34,282,34,282,34,282,34,282,28,282,34,282,34,282,34,282,34,293,34,294,34,282,0,0,0,0,0,0,0,0];
const ext = y => { const i=cl(Math.round(y/2),0,EXT.length/2-1)*2; return [EXT[i],EXT[i+1]]; };
const FH  = (Y_PODIUM-Y_TOWER)/FLOORS;            // altura de um pavimento no desenho
const yF  = k => Y_PODIUM - k*FH;                  // cota do piso do pavimento k (0 = topo do embasamento)

/* ---------- imagens ---------- */
const traco=new Image(), luz=new Image();
let ready=0; const onload=()=>{ if(++ready===2) draw(T); };
traco.onload=onload; luz.onload=onload;
traco.src='img/obra/torre-traco.webp'; luz.src='img/obra/torre-luz.webp';

/* ---------- DOM ---------- */
const $ = s => root.querySelector(s);
const cv = $('canvas'), ctx = cv.getContext('2d');
const hudPhase=$('#hudPhase'), hudA=$('#hudA'), hudB=$('#hudB'), hudTime=$('#hudTime');
const seek=$('#obraSeek'), fill=$('.obra-track .fill'), knob=$('.obra-track .knob'), timeEl=$('#obraTime');
const playBtn=$('#obraPlay');
const chList=$('#obraCh');
const plan=$('.obra-plan'), plZoom=$('.pl-zoom'), plBox=$('.pl-lines'), realBox=$('.pl-realbox'), plBtn=$('.pl-btn'), zv=$('.pl-zv');

seek.max=DUR*1000;
chList.innerHTML = PH.map((p,i)=>`<li><button type="button" data-i="${i}">
  <span class="n">${String(i+1).padStart(2,'0')}</span><span class="t">${p[1]}</span>
  <span class="tc">${clock(p[0])}</span><span class="d">${p[2]}</span><i class="bar"></i></button></li>`).join('');
const chItems=[...chList.children];
const track=$('.obra-track');
PH.forEach(p=>{ const k=document.createElement('i'); k.className='tk'; k.style.left=(p[0]/DUR*100)+'%'; track.insertBefore(k,seek); });

function clock(s){ s=Math.floor(s); return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); }

/* ---------- planta em linhas ---------- */
plBox.insertAdjacentHTML('beforeend', window.PLANTA||'');
const svg=plBox.querySelector('svg');
const plGroups={};
if(svg){
  svg.querySelectorAll('.pl-g').forEach(g=>{
    plGroups[g.dataset.g]=g;
    const kids=[...g.children];
    // ordem do traço: de cima para baixo, como uma plotter
    const ys=kids.map(k=>{ try{ const b=k.getBBox(); return b.y+b.height/2; }catch(e){ return 0; } });
    kids.forEach((k,i)=>k.style.setProperty('--i',(cl(ys[i]/807)*.85+rnd(i,3)*.15).toFixed(3)));
  });
}
/* janelas de desenho de cada grupo [início, fim] */
const PLAN_T={walls:[28.7,31.0], glass:[29.9,31.2], fix:[30.6,32.8], furn:[31.4,34.4], soft:[33.0,34.8], text:[34.0,36.0]};
let real=false;
plBtn.addEventListener('click',()=>{
  real=!real;
  plan.classList.toggle('real',real);
  plBtn.setAttribute('aria-pressed',real);
  plBtn.querySelector('span').textContent = real ? 'Ver em linhas' : 'Imagem real';
  zoomTo(1);
});

/* ---------- zoom da planta: botões, arrastar e pinça ---------- */
const Z_MIN=1, Z_MAX=5, Z_STEP=1.5;
const zs={z:1,x:0,y:0};
const boxRect=()=>{ const b=real?realBox:plBox; return {x:b.offsetLeft,y:b.offsetTop,w:b.offsetWidth,h:b.offsetHeight}; };
function clampPan(){
  const r=boxRect(), z=zs.z;
  const fit=(p,b0,bw,view)=>{ const W=bw*z; return W<=view ? (view-W)/2-b0*z : cl(p,view-(b0+bw)*z,-b0*z); };
  zs.x=fit(zs.x,r.x,r.w,cw); zs.y=fit(zs.y,r.y,r.h,ch);
}
function applyZoom(anim=true){
  if(zs.z<=1.001){ zs.z=1; zs.x=0; zs.y=0; } else clampPan();
  plZoom.style.transition=anim?'transform .45s var(--ease)':'none';
  plZoom.style.transform=`translate(${zs.x}px,${zs.y}px) scale(${zs.z})`;
  plan.classList.toggle('zoomed',zs.z>1);
  zv.textContent=Math.round(zs.z*100)+'%';
  root.querySelector('[data-z="out"]').disabled=zs.z<=Z_MIN;
  root.querySelector('[data-z="in"]').disabled=zs.z>=Z_MAX-.001;
}
function zoomTo(z,cx=cw/2,cy=ch/2,anim=true){
  z=cl(z,Z_MIN,Z_MAX);
  zs.x=cx-(cx-zs.x)*(z/zs.z); zs.y=cy-(cy-zs.y)*(z/zs.z); zs.z=z;
  applyZoom(anim);
}
root.querySelector('[data-z="in"]').addEventListener('click',()=>zoomTo(zs.z*Z_STEP));
root.querySelector('[data-z="out"]').addEventListener('click',()=>zoomTo(zs.z/Z_STEP));
zv.addEventListener('click',()=>zoomTo(1));
plan.addEventListener('dblclick',e=>{
  if(e.target.closest('button')) return;
  const r=plan.getBoundingClientRect();
  zoomTo(zs.z>=Z_MAX-.001?1:zs.z*2,e.clientX-r.left,e.clientY-r.top);
});
const ptrs=new Map(); let pinch=null;
plan.addEventListener('pointerdown',e=>{
  if(e.target.closest('button')||!root.classList.contains('plan-ready')) return;
  ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  plan.setPointerCapture(e.pointerId);
  if(ptrs.size===2){ const [a,b]=[...ptrs.values()]; pinch={d:Math.hypot(a.x-b.x,a.y-b.y),z:zs.z}; }
});
plan.addEventListener('pointermove',e=>{
  const p=ptrs.get(e.pointerId); if(!p) return;
  const r=plan.getBoundingClientRect();
  if(ptrs.size===2&&pinch){
    ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const [a,b]=[...ptrs.values()];
    zoomTo(pinch.z*Math.hypot(a.x-b.x,a.y-b.y)/pinch.d,(a.x+b.x)/2-r.left,(a.y+b.y)/2-r.top,false);
  }else if(zs.z>1){
    zs.x+=e.clientX-p.x; zs.y+=e.clientY-p.y; applyZoom(false);
    ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  }
});
const endPtr=e=>{ ptrs.delete(e.pointerId); if(ptrs.size<2) pinch=null; };
plan.addEventListener('pointerup',endPtr); plan.addEventListener('pointercancel',endPtr);

/* ---------- câmera 2D (coordenadas da imagem) ---------- */
let cw=0, ch=0, dpr=1;
const cam={x:0,y:0,s:1};
function resize(){
  const r=cv.getBoundingClientRect();
  dpr=Math.min(2,window.devicePixelRatio||1);
  cw=r.width; ch=r.height;
  cv.width=Math.round(cw*dpr); cv.height=Math.round(ch*dpr);
  // caixas da planta: o desenho em linhas e a imagem real, os dois em pé e do mesmo tamanho
  const fitBox=(el,aw,ah,padT,padB,padX)=>{
    let h=ch-padT-padB, w=h*aw/ah;
    if(w>cw-2*padX){ w=cw-2*padX; h=w*ah/aw; }
    Object.assign(el.style,{width:w+'px',height:h+'px',left:(cw-w)/2+'px',top:(padT+(ch-padT-padB-h)/2)+'px'});
  };
  const sv=plBox.querySelector('svg');
  fitBox(plBox,+(sv?.dataset.w||532),+(sv?.dataset.h||808),Math.max(124,ch*.16),Math.max(72,ch*.09),16);
  fitBox(realBox,550,807,Math.max(124,ch*.16),Math.max(72,ch*.09),16);
  applyZoom(false);
  draw(T);
}
const toScreen=()=>ctx.setTransform(dpr*cam.s,0,0,dpr*cam.s,dpr*(cw/2-cam.x*cam.s),dpr*(ch/2-cam.y*cam.s));
const lw=px=>px/cam.s;

/* ---------- cota revelada em função do tempo ---------- */
function revealY(t){
  if(t<2.4) return Y_BASE;
  if(t<4.6) return lerp(Y_BASE,Y_GROUND,eio(cl((t-2.6)/1.8)));
  if(t<T_TOWER0) return lerp(Y_GROUND,Y_PODIUM,eio(cl((t-4.7)/2.5)));
  if(t<T_TOWER1){
    const f=cl((t-T_TOWER0)/(T_TOWER1-T_TOWER0-.2))*FLOORS;
    const k=Math.floor(f), fr=f-k;
    return k>=FLOORS ? Y_TOWER : yF(k+ss(0,.72,fr));
  }
  return lerp(Y_TOWER,Y_CROWN,eio(cl((t-21.1)/2.1)));
}
function floorsDone(t){
  if(t<T_TOWER0) return 0;
  return Math.min(FLOORS,Math.floor(cl((t-T_TOWER0)/(T_TOWER1-T_TOWER0-.2))*FLOORS+.28));
}

/* ============================================================
   RENDER
   ============================================================ */
function draw(t){
  if(!cw) return;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,cw,ch);

  const ry=revealY(t);
  const bA = 1-ss(27.3,28.6,t);          // o prédio sai quando a planta entra
  const craneA = ss(4.2,4.9,t)*(1-ss(21,22.4,t));

  /* ----- câmera ----- */
  const FULL=Y_BASE+34-(Y_CROWN-70), MIDY=(Y_BASE+34+Y_CROWN-70)/2;
  const V=cl((Y_BASE-ry)*1.3+170,260,FULL);
  const kF=V>=FULL?1:(V-260)/(FULL-260);
  let ex={x:lerp(150,140,kF), y:lerp(Y_BASE+34-V/2,MIDY,kF), s:Math.min(ch/V, cw/390)};
  const fy=yF(FLOOR)-FH/2;
  const inn={x:150, y:fy, s:Math.min(ch/46, cw/170)};
  const k=eio(cl((t-25.8)/2.4));
  cam.x=lerp(ex.x,inn.x,k); cam.y=lerp(ex.y,inn.y,k); cam.s=Math.exp(lerp(Math.log(ex.s),Math.log(inn.s),k));
  toScreen();
  ctx.lineCap='butt'; ctx.lineJoin='miter';

  if(bA>0){
    ctx.globalAlpha=bA;

    /* 1. terreno: linha do solo + marcos */
    const gp=ss(.2,1.8,t);
    ctx.beginPath(); ctx.moveTo(-70,Y_GROUND); ctx.lineTo(-70+(IMG_W+140)*gp,Y_GROUND);
    ctx.strokeStyle=pw(.5); ctx.lineWidth=lw(1); ctx.stroke();
    const mk=ss(1.0,1.8,t)*(1-ss(4.6,6,t));
    if(mk>0){
      ctx.beginPath();
      [[34,Y_GROUND],[290,Y_GROUND]].forEach(([x,y])=>{ ctx.moveTo(x-6,y); ctx.lineTo(x+6,y); ctx.moveTo(x,y-6); ctx.lineTo(x,y+6); });
      ctx.strokeStyle=rw(.9*mk); ctx.lineWidth=lw(1.2); ctx.stroke();
      ctx.setLineDash([lw(4),lw(4)]); ctx.beginPath(); ctx.moveTo(34,Y_GROUND-2); ctx.lineTo(290,Y_GROUND-2);
      ctx.strokeStyle=rw(.7*mk); ctx.lineWidth=lw(1); ctx.stroke(); ctx.setLineDash([]);
    }

    /* 3. estacas da fundação */
    const pA=ss(2.3,2.8,t)*(1-ss(5.5,7,t));
    if(pA>0){
      ctx.beginPath();
      [44,72,100,128,156,184,212,240,268].forEach((x,i)=>{
        const p=ss(2.4+i*.08,3.4+i*.08,t);
        ctx.moveTo(x,Y_GROUND); ctx.lineTo(x,Y_GROUND+36*p);
      });
      ctx.setLineDash([lw(3),lw(3)]); ctx.strokeStyle=pw(.5*pA); ctx.lineWidth=lw(1); ctx.stroke(); ctx.setLineDash([]);
    }

    /* 4. o que já foi construído: o traço original, recortado na cota ry */
    if(ready===2 && ry<Y_BASE){
      ctx.save();
      ctx.beginPath(); ctx.rect(-10,ry,IMG_W+20,IMG_H-ry+10); ctx.clip();
      ctx.globalAlpha=bA*.94;
      ctx.drawImage(traco,0,0,IMG_W,IMG_H);
      /* 5. luz: cada pavimento acende no seu tempo */
      if(t>23.3){
        const bands=[[Y_PODIUM,Y_GROUND,-1]];
        for(let f=1;f<=FLOORS;f++) bands.push([yF(f),yF(f-1),f]);
        bands.push([0,Y_TOWER,FLOORS+1]);
        bands.forEach(([y0,y1,f])=>{
          const st=23.4+rnd(f,9)*1.7;
          let a=ss(st,st+.45,t)*(.55+rnd(f,4)*.45);
          if(f===FLOOR) a=Math.max(a,ss(25.6,26.2,t));
          if(a<=.01) return;
          ctx.globalAlpha=bA*a;
          ctx.drawImage(luz,0,y0/IMG_H*luz.height,luz.width,(y1-y0)/IMG_H*luz.height,0,y0,IMG_W,y1-y0);
        });
      }
      ctx.restore();
      ctx.globalAlpha=bA;
    }

    /* 6. laje em execução: linha dourada + fôrma do próximo pavimento */
    const building = t>2.5 && t<23.3 && ry>Y_CROWN+1;
    if(building){
      const [x0,x1]=ext(ry+1);
      ctx.beginPath(); ctx.moveTo(x0-4,ry); ctx.lineTo(x1+4,ry);
      ctx.strokeStyle=rw(.95); ctx.lineWidth=lw(1.6); ctx.stroke();
      if(t>T_TOWER0 && t<T_TOWER1){
        const [a0,a1]=ext(ry-FH);
        ctx.setLineDash([lw(2),lw(3)]);
        ctx.beginPath(); ctx.moveTo(a0-3,ry-FH*1.4); ctx.lineTo(a1+3,ry-FH*1.4);
        for(let x=a0;x<=a1;x+=12){ ctx.moveTo(x,ry); ctx.lineTo(x,ry-FH*1.4); }
        ctx.strokeStyle=pw(.35); ctx.lineWidth=lw(1); ctx.stroke(); ctx.setLineDash([]);
      }
    }

    /* 7. grua */
    if(craneA>0) crane(t,ry,craneA*bA);

    /* 8. destaque da Penthouse antes do mergulho */
    const hl=ss(25.6,26.2,t);
    if(hl>0){
      const y0=yF(FLOOR), y1=yF(FLOOR-1), [x0,x1]=ext(y0+FH/2);
      ctx.strokeStyle=rw(hl); ctx.lineWidth=lw(1.6);
      ctx.strokeRect(x0-3,y0,x1-x0+6,y1-y0);
      ctx.beginPath(); ctx.moveTo(x1+8,y0+FH/2); ctx.lineTo(x1+8+30*hl,y0+FH/2); ctx.stroke();
    }
    ctx.globalAlpha=1;
  }

  plan.style.opacity=ss(28.1,28.9,t);
  plan.style.visibility=t>28.05?'visible':'hidden';
  plan.style.setProperty('--z',lerp(1.06,1,eio(ss(28.1,30,t))));
  for(const g in PLAN_T){ const [a,b]=PLAN_T[g]; if(plGroups[g]) plGroups[g].style.setProperty('--p',cl((t-a)/(b-a))); }
  root.classList.toggle('plan-ready',t>=35.2);
  if(t<35.2&&zs.z>1) zoomTo(1,cw/2,ch/2,false);

  hud(t,ry);
}

/* ---------- grua de torre (em elevação) ---------- */
function crane(t,ry,a){
  ctx.globalAlpha=a;
  const mx=6, mw=7;
  const top=Math.max(Math.min(ry-26,Y_GROUND-60),Y_TOWER-70)*1;
  const rise=ss(4.2,5.2,t), topY=lerp(Y_GROUND,top,rise);
  ctx.beginPath();
  ctx.moveTo(mx,Y_GROUND); ctx.lineTo(mx,topY); ctx.moveTo(mx+mw,Y_GROUND); ctx.lineTo(mx+mw,topY);
  for(let y=Y_GROUND; y>topY+mw; y-=mw){ ctx.moveTo(mx,y); ctx.lineTo(mx+mw,y-mw); ctx.moveTo(mx,y-mw); ctx.lineTo(mx+mw,y-mw); }
  const jp=ss(4.9,5.8,t);
  const jL=-34, jR=205;
  ctx.moveTo(mx+mw/2,topY); ctx.lineTo(lerp(mx+mw/2,jR,jp),topY);
  ctx.moveTo(mx+mw/2,topY); ctx.lineTo(lerp(mx+mw/2,jL,jp),topY);
  ctx.moveTo(mx+mw/2,topY); ctx.lineTo(mx+mw/2,topY-16*jp);
  if(jp>.02){ ctx.moveTo(mx+mw/2,topY-16*jp); ctx.lineTo(lerp(mx+mw/2,jR*.8,jp),topY); ctx.moveTo(mx+mw/2,topY-16*jp); ctx.lineTo(lerp(mx+mw/2,jL,jp),topY); }
  ctx.strokeStyle=pw(.55); ctx.lineWidth=lw(.9); ctx.stroke();
  if(jp>.9){
    ctx.fillStyle=rw(.8); ctx.globalAlpha=a*.85; ctx.fillRect(jL,topY+1,12,8); ctx.globalAlpha=a;
    const tx=120+Math.sin(t*1.05)*62, hy=Math.min(ry-6, topY+30+Math.abs(Math.sin(t*1.5))*Math.max(0,ry-topY-40));
    ctx.beginPath(); ctx.moveTo(tx,topY); ctx.lineTo(tx,hy); ctx.strokeStyle=pw(.5); ctx.lineWidth=lw(.8); ctx.stroke();
    ctx.strokeStyle=rw(.95); ctx.lineWidth=lw(1.1); ctx.strokeRect(tx-6,hy,12,5);
  }
  ctx.globalAlpha=1;
}

/* ---------- HUD, capítulos, números ---------- */
let lastPh=-1;
function hud(t,ry){
  let ph=0; for(let i=0;i<PH.length;i++) if(t>=PH[i][0]) ph=i;
  if(ph!==lastPh){
    hudPhase.textContent=PH[ph][1];
    chItems.forEach((li,i)=>{ li.classList.toggle('on',i===ph); li.classList.toggle('done',i<ph); });
    lastPh=ph;
  }
  chItems.forEach((li,i)=>{
    const a=PH[i][0], b=i<PH.length-1?PH[i+1][0]:DUR;
    li.querySelector('.bar').style.transform=`scaleX(${cl((t-a)/(b-a))})`;
  });

  const nf=floorsDone(t);
  let A,B,red=false;
  if(ph===0){ A='Cota ±0,00'; B='Implantação no lote'; }
  else if(ph===1){ A='Cota ±0,00'; B='Fundação'; }
  else if(ph===2){ A=`Embasamento`; B=`${Math.round(ss(4.7,7.2,t)*100)}% da base`; }
  else if(ph===3){ A=nf? `Pavimento ${nf} de ${FLOORS}` : 'Embasamento pronto'; B=`${Math.round(nf/FLOORS*100)}% da torre`; }
  else if(ph===4){ A=`Pavimento ${FLOORS} de ${FLOORS}`; B='Coroamento'; }
  else if(ph===5){ A=`${FLOORS} pavimentos`; B=`${Math.round(ss(23.4,25.5,t)*100)}% das unidades acesas`; }
  else if(ph===6){ A=`Pavimento ${FLOOR} de ${FLOORS}`; B='Penthouse'; red=true; }
  else { A='Planta da Penthouse'; B='4 suítes e 342,60m² privativos'; red=true; }
  hudA.textContent=A; hudB.textContent=B; hudB.classList.toggle('hud-red',red);

  const pct=t/DUR*100;
  fill.style.width=pct+'%'; knob.style.left=pct+'%';
  if(!dragging) seek.value=Math.round(t*1000);
  timeEl.textContent=`${clock(t)} / ${clock(DUR)}`; hudTime.textContent=clock(t);
  seek.setAttribute('aria-valuetext',`${clock(t)}, ${PH[ph][1]}`);

}

/* ============================================================
   PLAYER
   ============================================================ */
let T=0, playing=false, last=0, userPaused=false, dragging=false;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

function setState(){
  root.classList.toggle('playing',playing);
  root.classList.toggle('ended',!playing&&T>=DUR);
  playBtn.setAttribute('aria-label',playing?'Pausar animação':T>=DUR?'Assistir de novo':'Reproduzir animação');
}
function loop(now){
  if(!playing) return;
  T=Math.min(DUR,T+(now-last)/1000); last=now;
  draw(T);
  if(T>=DUR){ playing=false; setState(); return; }
  requestAnimationFrame(loop);
}
function play(){ if(playing) return; if(T>=DUR) T=0; playing=true; last=performance.now(); setState(); requestAnimationFrame(loop); }
function pause(){ playing=false; setState(); }
function go(t){ T=cl(t,0,DUR); draw(T); setState(); }

playBtn.addEventListener('click',()=>{ if(playing){ pause(); userPaused=true; } else { userPaused=false; play(); } });
seek.addEventListener('input',()=>{ dragging=true; go(seek.value/1000); });
seek.addEventListener('change',()=>{ dragging=false; });
seek.addEventListener('pointerdown',()=>{ root._was=playing; pause(); });
seek.addEventListener('pointerup',()=>{ dragging=false; if(root._was&&T<DUR) play(); });
chList.addEventListener('click',e=>{
  const b=e.target.closest('button[data-i]'); if(!b) return;
  go(PH[+b.dataset.i][0]+.001); userPaused=false; play();
});

new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){ resize(); if(!userPaused&&!reduce&&T<DUR) play(); }
  else pause();
}),{threshold:.35}).observe($('.obra-stage'));

new ResizeObserver(()=>resize()).observe(cv);

window.obraGo=t=>{pause();userPaused=true;go(t);};
if(reduce){ T=DUR; }
(document.fonts&&document.fonts.load ? document.fonts.load('400 12px "DM Sans"') : Promise.resolve()).finally(()=>{ resize(); setState(); });
})();
