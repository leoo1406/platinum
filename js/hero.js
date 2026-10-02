/* ============================================================
   HERO PLATINUM — 3 cenas em sequência, com cruzamento suave
     cena 1  vídeo   img/hero/cena-1.mp4   (PLATINUM já vem no vídeo)
     cena 2  imagem  img/hero/cena-2.webp  (PLATINUM já vem na imagem; vai virar vídeo)
     cena 3  vídeo   img/hero.mp4          (interno, sem texto)
   Cada cena SEMPRE começa do começo quando chega a vez dela: o vídeo da
   próxima cena fica carregado e parado no 1º quadro até a troca.

   ---------- como trocar os arquivos ----------
   Imagem → vídeo: na cena 2, troque  image:'...'  por  video:'img/hero/cena-2.mp4', poster:'img/hero/cena-2.webp'
   Celular: preencha o bloco  tall  de cada cena com os arquivos verticais (9:16).
            Enquanto ele não existir, o celular usa os mesmos arquivos do desktop.
   dur: quanto tempo a cena fica na tela (s). A troca começa FADE s antes do fim,
        então use a duração do vídeo para ele terminar exatamente quando sai.
   text:false esconde o título e os links do topo (usado no interno).
   ============================================================ */
(()=>{
const hero=document.getElementById('hero');
const box=document.getElementById('heroScenes');
if(!hero||!box) return;

const TODAS=[
  { dur:8,  wide:{video:'img/hero/cena-1.mp4', poster:'img/hero/cena-1.webp'}, tall:null },
  { dur:8,  wide:{image:'img/hero/cena-2.webp'},                               tall:null },
  { dur:10, wide:{video:'img/hero.mp4', poster:'img/hero-poster.webp'},
            tall:{video:'img/hero-mobile.mp4', poster:'img/hero-poster-mobile.webp'}, video:true },
];
/* HERO_SO_VIDEO = true → só o vídeo (cena 3), em loop, com o título à esquerda.
   As duas imagens (cenas 1 e 2) continuam aqui e na pasta img/hero/: para voltar às 3 cenas,
   troque para false (e, se quiser o interno sem texto, recoloque  text:false  na cena 3). */
const HERO_SO_VIDEO=true;
const SCENES=HERO_SO_VIDEO ? TODAS.filter(sc=>sc.video) : TODAS;
const FADE=1.6;                 // tempo do cruzamento entre cenas (s) — igual ao .hs do css/hero.css

const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const tall=matchMedia('(max-width: 820px)').matches;
const toggle=document.getElementById('heroToggle');

/* ---------- monta as cenas ---------- */
const S=SCENES.map((sc,i)=>{
  const m=(tall&&sc.tall)||sc.wide;
  const el=document.createElement('div'); el.className='hs'+(sc.interior?' int':'');
  box.appendChild(el);
  const o={sc,el,video:null};
  if(m.video){
    const v=document.createElement('video');
    v.muted=true; v.loop=SCENES.length===1; v.playsInline=true; v.preload=i===0?'auto':'metadata';
    v.setAttribute('muted',''); v.setAttribute('playsinline','');
    if(m.poster) v.poster=m.poster;
    v.addEventListener('error',()=>{ v.remove(); o.video=null;           // sem vídeo, fica a foto
      if(m.poster){ const im=new Image(); im.alt=''; im.src=m.poster; el.appendChild(im); } },true);
    v.src=m.video;
    el.appendChild(v); o.video=v;
  }else if(m.image){
    const im=new Image(); im.alt=''; im.decoding='async'; im.src=m.image;
    if(i>0) im.loading='eager';
    el.appendChild(im);
  }
  return o;
});

/* deixa o vídeo pronto no 1º quadro, parado */
function arm(o){
  const v=o.video; if(!v) return;
  v.pause();
  if(v.preload!=='auto'){ v.preload='auto'; v.load(); }
  try{ v.currentTime=0; }catch(e){}
}
/* começa do zero e toca */
function start(o){
  const v=o.video; if(!v) return;
  try{ v.currentTime=0; }catch(e){}
  if(!paused) v.play().catch(()=>{});
}

/* ---------- sequência ---------- */
let cur=-1, t0=0, paused=false, raf=0, pausedAt=0, visible=true;
function show(i){
  const prev=cur; cur=i;
  S.forEach((o,j)=>o.el.classList.toggle('on',j===i));
  start(S[i]);
  // o anterior continua durante o cruzamento e depois para (e volta ao começo)
  if(prev>=0&&prev!==i) setTimeout(()=>{ if(cur!==prev) arm(S[prev]); },FADE*1000+120);
  // a próxima cena já carrega, mas fica parada no 1º quadro
  const next=S[(i+1)%S.length]; if(next!==S[i]&&next!==S[prev]) arm(next);
  if(S[i].sc.text===false) hero.classList.add('is-int');
}
function tick(now){
  raf=requestAnimationFrame(tick);
  if(paused||S.length<2) return;               // cena única: o próprio vídeo fica em loop
  const o=S[cur];
  if((now-t0)/1000 >= o.sc.dur-FADE){ t0=now; show((cur+1)%S.length); }
}

toggle.addEventListener('click',()=>{
  paused=!paused;
  hero.classList.toggle('paused',paused);
  toggle.setAttribute('aria-label',paused?'Continuar o vídeo do topo':'Pausar o vídeo do topo');
  if(paused){ pausedAt=performance.now(); S.forEach(s=>s.video&&s.video.pause()); }
  else { t0+=performance.now()-pausedAt; S[cur].video&&S[cur].video.play().catch(()=>{}); }
});

/* fora da tela: tudo para e o relógio da cena congela */
new IntersectionObserver(es=>{
  visible=es[0].isIntersecting;
  if(visible){
    if(!raf){ if(pausedAt&&!paused) t0+=performance.now()-pausedAt; raf=requestAnimationFrame(tick); }
    if(!paused) S[cur].video&&S[cur].video.play().catch(()=>{});
  }else{
    cancelAnimationFrame(raf); raf=0; pausedAt=performance.now();
    S.forEach(s=>s.video&&s.video.pause());
  }
},{threshold:.01}).observe(hero);

/* ---------- texto do topo: fica TEXTO_SEG segundos e some, sobrando só o vídeo ----------
   O tempo começa quando o título termina de aparecer (depois do carregamento).
   Ao voltar para o Início, ou rolar de volta até o topo, o texto aparece de novo pelo mesmo tempo. */
const TEXTO_SEG=5;
const h1=hero.querySelector('.hero-in h1');
let tTexto=0;
if(h1) new MutationObserver(()=>{
  clearTimeout(tTexto);
  if(h1.classList.contains('rv')){
    hero.classList.remove('is-int');
    tTexto=setTimeout(()=>hero.classList.add('is-int'),TEXTO_SEG*1000+900);   // +0,9 s = entrada do título
  }else hero.classList.remove('is-int');
}).observe(h1,{attributes:true,attributeFilter:['class']});

if(reduce){ paused=true; hero.classList.add('paused'); }
show(0); t0=performance.now();
})();
