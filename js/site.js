/* ============================================================
   Motor do site
   roteador · animações · mosaico · diferenciais · galeria · tela cheia
   ============================================================ */
const $  = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

let ready=false,_done=false;
function finish(){
  if(_done) return; _done=true;
  $('#pre').classList.add('gone');
  document.body.classList.remove('lock');
  ready=true; scan(document);
}
window.addEventListener('load',()=>setTimeout(finish,reduce?80:1500));
setTimeout(finish,reduce?150:3200);
document.body.classList.add('lock');

/* cursor personalizado removido: o site usa o cursor padrão do sistema */

function split(el){
  if(el.dataset.done) return; el.dataset.done=1;
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w=>`<span class="w"><i>${w}</i></span>`).join(' ');
  $$('.w i',el).forEach((i,k)=>i.style.transitionDelay=(k*0.055)+'s');
}

const io = new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('rv');
      if(e.target.classList.contains('stats')) countAll(e.target);
    } else {
      e.target.classList.remove('rv');
      if(e.target.classList.contains('stats')) resetCount(e.target);
    }
  });
},{threshold:0,rootMargin:'0px 0px -12% 0px'});

function scan(root=document){
  if(!ready) return;
  $$('[data-split]',root).forEach(split);
  $$('[data-split],.up,.clip,.diag,.rule,.stats',root).forEach((el,i)=>{
    if(el.classList.contains('up')||el.classList.contains('clip')||el.classList.contains('diag'))
      el.style.transitionDelay=((i%6)*0.07)+'s';
    io.observe(el);
  });
}

/* ---------- contadores (sequência: linha → número → texto) ----------
   COUNT_MS   : quanto tempo cada número leva para contar até o valor final.
   COUNT_STEP : atraso entre um número e o próximo. Se mudar aqui, mude também
                o `--d` de `.stat:nth-child(...)` no CSS, que controla a linha
                dourada e a entrada do texto — os dois usam o mesmo ritmo.
   -------------------------------------------- */
const COUNT_MS = 3100;
const COUNT_STEP = 250;
let countRun = 0;             // cancela a contagem anterior se a seção sair e voltar
function countAll(stats){
  if(stats.dataset.ran) return; stats.dataset.ran=1;
  const run = stats.dataset.run = ++countRun;
  $$('[data-count]',stats).forEach((el,i)=>{
    const end=+el.dataset.count, start=el.dataset.start===undefined?0:+el.dataset.start;
    const pre=el.dataset.prefix||'', suf=el.dataset.suffix||'';
    const fim=pre+end.toLocaleString('pt-BR')+suf;
    if(reduce){ el.textContent=fim; return; }
    el.textContent=pre+start.toLocaleString('pt-BR')+suf;
    setTimeout(()=>{
      if(+stats.dataset.run!==run) return;
      const t0=performance.now();
      (function step(t){
        if(+stats.dataset.run!==run) return;
        const p=Math.min((t-t0)/COUNT_MS,1);
        const e=1-Math.pow(1-p,3);
        el.textContent=pre+Math.round(start+(end-start)*e).toLocaleString('pt-BR')+suf;
        if(p<1) requestAnimationFrame(step); else el.textContent=fim;
      })(performance.now());
    }, i*COUNT_STEP+270);
  });
}
/* rearma a seção para contar de novo na próxima vez que ela entrar na tela */
function resetCount(stats){
  if(reduce) return;
  stats.dataset.run = ++countRun;
  delete stats.dataset.ran;
  $$('[data-count]',stats).forEach(el=>{
    const start=el.dataset.start===undefined?0:+el.dataset.start;
    el.textContent=(el.dataset.prefix||'')+start.toLocaleString('pt-BR')+(el.dataset.suffix||'');
  });
}

let lastY=0;
addEventListener('scroll',()=>{
  const y=scrollY, hd=$('#hd');
  hd.classList.toggle('solid',y>40);
  hd.classList.toggle('hide',y>240 && y>lastY && !document.body.classList.contains('menu-open'));
  lastY=y;
},{passive:true});

const menu=$('#menu');
$('#bg').onclick=()=>{
  const open=document.body.classList.toggle('menu-open');
  menu.classList.toggle('open',open);
  document.body.classList.toggle('lock',open);
};
$$('.menu-l a').forEach((a,i)=>a.addEventListener('mouseenter',()=>{
  $$('#menuImgs img').forEach((im,k)=>im.classList.toggle('on',k===i));
}));
function closeMenu(){ document.body.classList.remove('menu-open','lock'); menu.classList.remove('open'); }

/* ---------- estúdio: a abertura escurece e o título sobe conforme a página desliza sobre a foto ---------- */
(function estudioHero(){
  const hero=$('.st-hero'); if(!hero || reduce) return;
  let raf=0;
  const tick=()=>{ raf=0;
    if(!hero.offsetParent) return;               // página do estúdio fechada
    const k=Math.min(1,Math.max(0,scrollY/(hero.offsetHeight*.8)));
    hero.style.setProperty('--k',k.toFixed(3));
  };
  addEventListener('scroll',()=>{ if(!raf) raf=requestAnimationFrame(tick); },{passive:true});
  addEventListener('hashchange',()=>setTimeout(tick,1200));
})();

(function diferenciais(){
  /* painéis horizontais: passar o mouse, focar ou clicar abre; setas navegam.
     No celular (pilha vertical) só o clique abre, e tocar no aberto não fecha. */
  const row=$('#svcList'); if(!row) return;
  const items=$$('.dif',row);
  let cur=items.findIndex(it=>it.classList.contains('on'));
  function open(i){
    if(i===cur) return;
    items.forEach((it,k)=>{
      const on=k===i; it.classList.toggle('on',on);
      $('.dif-btn',it).setAttribute('aria-expanded',on?'true':'false');
    });
    cur=i;
  }
  const hoverable=matchMedia('(hover:hover) and (pointer:fine)'), stacked=matchMedia('(max-width:1023px)');
  items.forEach((it,i)=>{
    const b=$('.dif-btn',it);
    b.addEventListener('click',()=>open(i));
    b.addEventListener('focus',()=>{ if(!stacked.matches) open(i); });
    it.addEventListener('mouseenter',()=>{ if(hoverable.matches && !stacked.matches) open(i); });
    b.addEventListener('keydown',e=>{
      const n=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:(e.key==='ArrowLeft'||e.key==='ArrowUp')?-1:0; if(!n) return;
      e.preventDefault(); $('.dif-btn',items[(i+n+items.length)%items.length]).focus();
    });
  });
  if(cur<0) open(0);

  /* tamanho: a altura dos painéis é a maior que deixa o prédio mais largo inteiro
     E ainda sobra coluna para o texto; se não der, o texto vai por cima da base do render */
  const OPEN=6, TEXT_MIN=220;
  const vh=()=>window.innerHeight/100;
  function size(){
    row.style.removeProperty('--rowh'); row.classList.remove('ovl');
    if(matchMedia('(max-width:1023px)').matches) return;
    const cs=getComputedStyle(row);
    const gap=parseFloat(cs.columnGap)||12, pad=parseFloat(cs.getPropertyValue('--pad'))||30;
    const n=items.length, ow=(row.clientWidth-gap*(n-1))*OPEN/(OPEN+n-1);
    const arMax=Math.max(...items.map(it=>parseFloat(it.style.getPropertyValue('--ar'))||.75));
    const cssH=Math.min(600,Math.max(440,62*vh()));
    let h=Math.min(cssH,(ow-TEXT_MIN-2*pad)/arMax);
    if(h<400){ h=cssH; row.classList.add('ovl'); }
    row.style.setProperty('--rowh',Math.round(h)+'px');
    row.style.setProperty('--ow',Math.round(ow)+'px');
  }
  let lastW=-1;
  new ResizeObserver(()=>{ if(row.clientWidth!==lastW){ lastW=row.clientWidth; size(); } }).observe(row);
  addEventListener('resize',size);
})();

function band(el,words){ if(!el) return; const h=words.map(w=>`<span>${w}</span>`).join(''); el.innerHTML=h+h+h+h; }
band($('#band2'),['Itapema','Porto Belo','Santa Catarina']);

function card(p,cls,style){
  return `<a class="card ${cls||p.span}" href="#/projeto/${p.slug}" data-link data-cat="${p.cat}" style="--pos:${p.coverPosition||'center'};${style||''}">
    <div class="ph"><img src="${p.cover}" alt="${p.title}" loading="lazy"></div>
    <div class="veil"></div><div class="gold-line"></div>
    <div class="cap"><small>${p.cat} · ${p.cidade}</small><h3>${p.title}</h3><u>Visualizar projeto</u></div>
  </a>`;
}
/* grupos de três: principal (8 col × 2 linhas) alternando de lado; sobras viram 2 metades ou 1 faixa larga */
function mosaic(list){
  let out='', row=1;
  for(let g=0; g<list.length; g+=3){
    const grp=list.slice(g,g+3), left=(g/3)%2===0;
    if(grp.length===3){
      // grupo à esquerda: principal é o 1º (01 grande, 02 e 03 à direita)
      // grupo espelhado: principal é o 3º (04 e 05 à esquerda, 06 grande)
      const main=left?grp[0]:grp[2], sides=left?[grp[1],grp[2]]:[grp[0],grp[1]];
      out+=card(main,'m-main',`--gc:${left?'1/9':'5/13'};--gr:${row}/${row+2}`);
      out+=card(sides[0],'m-side',`--gc:${left?'9/13':'1/5'};--gr:${row}`);
      out+=card(sides[1],'m-side',`--gc:${left?'9/13':'1/5'};--gr:${row+1}`);
      row+=2;
    } else if(grp.length===2){
      out+=card(grp[0],'m-half',`--gc:1/7;--gr:${row}`)+card(grp[1],'m-half',`--gc:7/13;--gr:${row}`); row++;
    } else {
      out+=card(grp[0],'m-wide',`--gc:1/13;--gr:${row}`); row++;
    }
  }
  return out;
}
const featured = (typeof HOME_FEATURED!=='undefined' ? HOME_FEATURED.map(s=>PROJECTS.find(p=>p.slug===s)).filter(Boolean) : []);
$('#homeGrid').innerHTML = mosaic(featured.length===6 ? featured : PROJECTS.slice(0,6));

const cats=['Todos',...new Set(PROJECTS.map(p=>p.cat))];
$('#filters').innerHTML = cats.map((c,i)=>`<button class="${i?'':'on'}" data-f="${c}" aria-pressed="${i?'false':'true'}">${c}</button>`).join('');

const norm = s => (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
let catAtual='Todos', busca='';

function pintaProjetos(){
  const q=norm(busca);
  const lista=PROJECTS.filter(p=>{
    if(catAtual!=='Todos' && p.cat!==catAtual) return false;
    if(!q) return true;
    return q.split(/\s+/).every(t=>norm(p.title+' '+p.cat+' '+p.cidade+' '+p.endereco).includes(t));
  });
  const grid=$('#allGrid');
  grid.innerHTML = lista.length ? mosaic(lista) : `<div class="no-hit">
      <p>Nenhum projeto encontrado para “${busca.replace(/[<>&]/g,'')}”.</p>
      <button class="btn" id="limpaBusca"><span>Ver os ${PROJECTS.length} projetos</span><i></i></button>
    </div>`;
  const n=$('#searchN'); if(n) n.textContent = q ? `${lista.length} de ${PROJECTS.length}` : '';
  const zerar=$('#limpaBusca'); if(zerar) zerar.onclick=()=>limpaBusca(true);
  scan(grid);
}
function limpaBusca(tudo){
  busca=''; $('#projSearch').value=''; $('#search').classList.remove('filled');
  if(tudo){ catAtual='Todos'; $$('#filters button').forEach(b=>{const on=b.dataset.f==='Todos';
    b.classList.toggle('on',on); b.setAttribute('aria-pressed',on?'true':'false');}); }
  pintaProjetos();
}
$$('#filters button').forEach(b=>b.onclick=()=>{
  $$('#filters button').forEach(x=>{x.classList.remove('on');x.setAttribute('aria-pressed','false')});
  b.classList.add('on'); b.setAttribute('aria-pressed','true');
  catAtual=b.dataset.f; pintaProjetos();
});
$('#projSearch').addEventListener('input',e=>{
  busca=e.target.value;
  $('#search').classList.toggle('filled',!!busca);
  pintaProjetos();
});
$('#projSearch').addEventListener('keydown',e=>{ if(e.key==='Escape' && busca) limpaBusca(); });
$('#searchX').onclick=()=>{ limpaBusca(); $('#projSearch').focus(); };
pintaProjetos();

const ICON_PAUSE='<svg class="ic-pause" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2v8M9 2v8" stroke="currentColor" stroke-width="1.6"/></svg>';
const ICON_PLAY='<svg class="ic-play" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2l7 4-7 4z" fill="currentColor"/></svg>';
const ICON_PREV='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
const ICON_NEXT='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
const ICON_FULL='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
const pad2=n=>String(n).padStart(2,'0');

function renderProject(slug){
  const p = PROJECTS.find(x=>x.slug===slug) || PROJECTS[0];
  const others = PROJECTS.filter(x=>x.slug!==p.slug).sort(()=>Math.random()-.5).slice(0,3);
  const temTexto = p.texto && p.texto.length;
  const imgs=[p.cover,...(p.gallery||[])];
  const plantas=(p.plantas||[]).filter(x=>x&&x.img);
  const heroImg  = p.heroImage || p.cover;
  const heroPos  = p.heroPosition || p.coverPosition || 'center';
  const mediaImg = p.mediaImage || (p.gallery && p.gallery[0]) || p.cover;

  const media = p.video
    ? `<img src="${p.videoPoster||mediaImg}" alt="" loading="lazy">
       <video autoplay muted loop playsinline preload="metadata" ${p.videoPoster?`poster="${p.videoPoster}"`:''} aria-label="Vídeo do empreendimento ${p.title}"><source src="${p.video}"></video>
       <button class="p-vid" id="pVid" aria-label="Pausar vídeo" aria-pressed="false">${ICON_PAUSE}${ICON_PLAY}</button>`
    : `<img src="${mediaImg}" alt="${p.title}" loading="lazy">`;

  $('#projPage').innerHTML = `
  <div class="p-hero" style="--pos:${heroPos}">
    <img src="${heroImg}" alt="${p.title}">
    <div class="in">
      <div class="kicker up">${p.cat} · ${p.cidade}</div>
      <h1 data-split style="margin-top:22px">${p.title}</h1>
    </div>
  </div>
  <div class="p-meta">
    <div><small>Categoria</small><b>${p.cat}</b></div>
    <div><small>Localização</small><b>${p.endereco}<br>${p.cidade} / SC</b></div>
    <div><small>Área</small><b>${p.area}</b></div>
    <div><small>Unidades</small><b>${p.unidades}</b></div>
  </div>
  <section class="p-edit">
    <div class="wrap">
      <div class="p-edit-text">
        <h2 class="up">${p.intro}</h2>
        ${temTexto ? p.texto.map(t=>`<p class="up">${t}</p>`).join('') : ''}
      </div>
      <div class="p-edit-media diag">${media}</div>
    </div>
  </section>
  <section class="gal-sec" aria-roledescription="galeria" aria-label="Galeria de ${p.title}">
    <div class="gal-head">
      <div><h2 class="up">${p.title}</h2></div>
      <div class="gal-count" aria-live="polite"><b id="galCur">01</b> / ${pad2(imgs.length)}</div>
    </div>
    <div class="gal-stage" id="galStage" tabindex="0" aria-label="Imagens de ${p.title}. Use as setas do teclado para navegar.">
      <div class="gal-track" id="galTrack">
        ${imgs.map((g,i)=>`<figure class="${i?'':'on'}"><img ${i?`data-src="${g}" loading="lazy"`:`src="${g}"`} alt="${p.title} — imagem ${i+1}" draggable="false"></figure>`).join('')}
      </div>
      <button class="gal-nav prev" id="galP" aria-label="Imagem anterior">${ICON_PREV}</button>
      <button class="gal-nav next" id="galN" aria-label="Próxima imagem">${ICON_NEXT}</button>
      <button class="gal-full" id="galF" aria-label="Abrir em tela cheia">${ICON_FULL}</button>
    </div>
    <div class="gal-dots" id="galDots" role="tablist" aria-label="Escolher imagem">
      ${imgs.map((_,i)=>`<button role="tab" aria-selected="${i?'false':'true'}" aria-label="Imagem ${i+1}"><i></i></button>`).join('')}
    </div>
  </section>
  ${plantas.length ? `
  <section class="pp-sec" id="plantas" aria-label="Plantas de ${p.title}">
    <div class="wrap">
      <div class="pp-head">
        <div><div class="kicker up">Plantas</div><h2 class="up">Conheça cada<br>metro do projeto.</h2></div>
        <div class="gal-count" aria-live="polite"><b id="ppCur">01</b> / ${pad2(plantas.length)}</div>
      </div>
      <div class="pp-body${plantas.length<2?' solo':''}">
        <div class="pp-tabs" role="tablist" aria-label="Escolher planta">
          ${plantas.map((pl,i)=>`<button role="tab" type="button" class="${i?'':'on'}" aria-selected="${i?'false':'true'}" aria-controls="ppView">
            <span class="n">${pad2(i+1)}</span><b>${pl.nome}</b>${pl.info?`<span class="i">${pl.info}</span>`:''}</button>`).join('')}
        </div>
        <div class="pp-view" id="ppView">
          <div class="pp-zoom" id="ppZoom">
            ${plantas.map((pl,i)=>`<figure class="${i?'':'on'}"><img ${i?`data-src="${pl.img}" loading="lazy"`:`src="${pl.img}"`} alt="Planta ${pl.nome} — ${p.title}" draggable="false"></figure>`).join('')}
          </div>
          <div class="pp-zui" role="group" aria-label="Zoom da planta">
            <button type="button" class="pp-zb" data-pz="out" aria-label="Diminuir zoom"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9" stroke="currentColor" stroke-width="1.4"/></svg></button>
            <button type="button" class="pp-zv" aria-label="Voltar ao tamanho original">100%</button>
            <button type="button" class="pp-zb" data-pz="in" aria-label="Aumentar zoom"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9M8 3.5v9" stroke="currentColor" stroke-width="1.4"/></svg></button>
          </div>
          <button class="gal-full" id="ppF" type="button" aria-label="Abrir planta em tela cheia">${ICON_FULL}</button>
        </div>
      </div>
    </div>
  </section>` : ''}
  <section>
    <div class="wrap">
      <div class="proj-head">
        <div><h2 class="up" style="margin-top:22px">Outros projetos</h2></div>
        <a href="#/projetos" data-link class="btn up"><span>Ver todos</span><i></i></a>
      </div>
      <div class="grid">${others.map(o=>card(o,'c-4 r-capa')).join('')}</div>
    </div>
  </section>`;

  const vb=$('#pVid');
  if(vb){
    const v=$('.p-edit-media video'); v.muted=true;
    if(reduce){ v.removeAttribute('autoplay'); v.pause(); vb.classList.add('paused'); vb.setAttribute('aria-label','Reproduzir vídeo'); }
    v.addEventListener('error',()=>{ v.remove(); vb.remove(); },true);
    vb.onclick=()=>{
      const paused=v.paused; if(paused) v.play(); else v.pause();
      vb.classList.toggle('paused',!paused);
      vb.setAttribute('aria-label',paused?'Pausar vídeo':'Reproduzir vídeo');
      vb.setAttribute('aria-pressed',paused?'false':'true');
    };
  }

  initGallery(imgs);
  if(plantas.length) initPlantas(plantas);
}

/* seção Plantas: abas + planta inteira, com zoom (botões, duplo clique, arrastar e pinça)
   e botão de tela cheia. Mesmo comportamento do zoom da planta da página inicial. */
function initPlantas(list){
  const tabs=$$('.pp-tabs button'), figs=$$('#ppView figure'), cur=$('#ppCur'), set=list.map(x=>x.img);
  const view=$('#ppView'), zoomEl=$('#ppZoom'), zv=$('.pp-zv'), zIn=$('[data-pz="in"]'), zOut=$('[data-pz="out"]');
  const Z_MIN=1, Z_MAX=5, Z_STEP=1.5, zs={z:1,x:0,y:0};
  let i=0;
  const cl=(v,a,b)=>Math.min(b,Math.max(a,v));
  /* retângulo real da planta dentro do quadro (object-fit:contain) */
  function box(){
    const f=figs[i], im=$('img',f), fw=f.offsetWidth, fh=f.offsetHeight;
    const ar=(im.naturalWidth&&im.naturalHeight)?im.naturalWidth/im.naturalHeight:fw/fh;
    let w=fw,h=fw/ar; if(h>fh){ h=fh; w=fh*ar; }
    return {x:f.offsetLeft+(fw-w)/2, y:f.offsetTop+(fh-h)/2, w, h};
  }
  function clamp(){
    const r=box(), z=zs.z, vw=view.clientWidth, vh=view.clientHeight;
    const fit=(p,b0,bw,v)=>{ const W=bw*z; return W<=v ? (v-W)/2-b0*z : cl(p,v-(b0+bw)*z,-b0*z); };
    zs.x=fit(zs.x,r.x,r.w,vw); zs.y=fit(zs.y,r.y,r.h,vh);
  }
  function apply(anim=true){
    if(zs.z<=1.001){ zs.z=1; zs.x=0; zs.y=0; } else clamp();
    zoomEl.style.transition=anim?'transform .45s var(--ease)':'none';
    zoomEl.style.transform=`translate(${zs.x}px,${zs.y}px) scale(${zs.z})`;
    view.classList.toggle('zoomed',zs.z>1);
    zv.textContent=Math.round(zs.z*100)+'%';
    zOut.disabled=zs.z<=Z_MIN; zIn.disabled=zs.z>=Z_MAX-.001;
  }
  function zoomTo(z,cx=view.clientWidth/2,cy=view.clientHeight/2,anim=true){
    z=cl(z,Z_MIN,Z_MAX);
    zs.x=cx-(cx-zs.x)*(z/zs.z); zs.y=cy-(cy-zs.y)*(z/zs.z); zs.z=z;
    apply(anim);
  }
  /* altura do quadro acompanha o formato da planta: horizontal = quadro mais baixo */
  function fitHeight(){
    const im=$('img',figs[i]); if(!im.naturalWidth) return;
    const ar=im.naturalWidth/im.naturalHeight, pad=parseFloat(getComputedStyle(figs[i]).top)||24;
    const max=Math.min(940,Math.max(520,innerHeight*.84)), min=window.innerWidth<768?300:380;
    const padB=parseFloat(getComputedStyle(figs[i]).bottom)||70;
    view.style.height=Math.round(cl((view.clientWidth-2*pad)/ar+pad+padB,min,max))+'px';
  }
  function show(n){
    i=n;
    figs.forEach((f,k)=>{ f.classList.toggle('on',k===n); const im=$('img',f); if(k===n&&!im.src&&im.dataset.src) im.src=im.dataset.src; });
    tabs.forEach((t,k)=>{ t.classList.toggle('on',k===n); t.setAttribute('aria-selected',k===n?'true':'false'); });
    cur.textContent=pad2(n+1);
    fitHeight(); zs.z=1; apply(false);
  }
  tabs.forEach((t,k)=>t.onclick=()=>show(k));
  $('.pp-tabs').addEventListener('keydown',e=>{
    if(e.key!=='ArrowDown'&&e.key!=='ArrowUp'&&e.key!=='ArrowRight'&&e.key!=='ArrowLeft') return;
    e.preventDefault(); const d=(e.key==='ArrowDown'||e.key==='ArrowRight')?1:-1;
    const n=(i+d+list.length)%list.length; show(n); tabs[n].focus();
  });
  zIn.onclick=()=>zoomTo(zs.z*Z_STEP);
  zOut.onclick=()=>zoomTo(zs.z/Z_STEP);
  zv.onclick=()=>zoomTo(1);
  $('#ppF').onclick=()=>openLb(set,i,false);
  view.addEventListener('dblclick',e=>{
    if(e.target.closest('button')) return;
    const r=view.getBoundingClientRect();
    zoomTo(zs.z>=Z_MAX-.001?1:zs.z*2,e.clientX-r.left,e.clientY-r.top);
  });
  /* Ctrl/⌘ + rodinha do mouse aproxima (a rodinha sozinha continua rolando a página) */
  view.addEventListener('wheel',e=>{
    if(!e.ctrlKey&&!e.metaKey) return;
    e.preventDefault(); const r=view.getBoundingClientRect();
    zoomTo(zs.z*(e.deltaY<0?1.15:1/1.15),e.clientX-r.left,e.clientY-r.top,false);
  },{passive:false});
  const ptrs=new Map(); let pinch=null;
  view.addEventListener('pointerdown',e=>{
    if(e.target.closest('button')) return;
    ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(zs.z>1||ptrs.size===2) view.setPointerCapture(e.pointerId);
    if(ptrs.size===2){ const [a,b]=[...ptrs.values()]; pinch={d:Math.hypot(a.x-b.x,a.y-b.y),z:zs.z}; }
  });
  view.addEventListener('pointermove',e=>{
    const p=ptrs.get(e.pointerId); if(!p) return;
    const r=view.getBoundingClientRect();
    if(ptrs.size===2&&pinch){
      ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
      const [a,b]=[...ptrs.values()];
      zoomTo(pinch.z*Math.hypot(a.x-b.x,a.y-b.y)/pinch.d,(a.x+b.x)/2-r.left,(a.y+b.y)/2-r.top,false);
    }else if(zs.z>1){
      zs.x+=e.clientX-p.x; zs.y+=e.clientY-p.y; apply(false);
      ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    }
  });
  const end=e=>{ ptrs.delete(e.pointerId); if(ptrs.size<2) pinch=null; };
  view.addEventListener('pointerup',end); view.addEventListener('pointercancel',end);
  figs.forEach((f,k)=>$('img',f).addEventListener('load',()=>{ if(k===i){ fitHeight(); apply(false); } }));
  window.addEventListener('resize',()=>{ fitHeight(); apply(false); });
  fitHeight(); apply(false);
  /* se as plantas do projeto forem horizontais (Manhattan, Yangzhou), as abas vão para cima
     e a planta ocupa a largura toda */
  Promise.all(set.map(src=>new Promise(r=>{ const t=new Image(); t.onload=()=>r(t.naturalWidth/t.naturalHeight); t.onerror=()=>r(1); t.src=src; })))
    .then(ars=>{
      const largas=ars.filter(a=>a>1.35).length;
      $('.pp-body').classList.toggle('wide',largas>ars.length/2);
      fitHeight(); apply(false);
    });
}

let gal=null;
function initGallery(imgs){
  const stage=$('#galStage'), track=$('#galTrack'), dots=$$('#galDots button'), cur=$('#galCur');
  const figsG=$$('figure',track);
  let i=0, swiped=false;
  const load=k=>{ const im=figsG[k]&&$('img',figsG[k]); if(im&&!im.src&&im.dataset.src){ im.src=im.dataset.src; } };
  const preload=()=>{ load(i); if(imgs.length>1){ load((i+1)%imgs.length); load((i-1+imgs.length)%imgs.length); } };
  function show(n,dir){
    n=(n+imgs.length)%imgs.length; if(n===i&&figsG[n].classList.contains('on')) return;
    stage.dataset.dir=dir||(n>i?'next':'prev');
    figsG.forEach((f,k)=>{
      if(k===n){ f.classList.remove('out'); void f.offsetWidth; f.classList.add('on'); }
      else if(f.classList.contains('on')){ f.classList.remove('on'); f.classList.add('out'); }
      else f.classList.remove('out');
    });
    dots.forEach((d,k)=>{ d.classList.toggle('on',k===n); d.setAttribute('aria-selected',k===n?'true':'false'); });
    i=n; cur.textContent=pad2(i+1); preload();
  }
  dots[0].classList.add('on');
  preload();
  $('#galP').onclick=()=>show(i-1,'prev');
  $('#galN').onclick=()=>show(i+1,'next');
  dots.forEach((d,k)=>d.onclick=()=>show(k));
  $('#galF').onclick=()=>openLb(imgs,i);
  track.addEventListener('click',e=>{ if(swiped){ swiped=false; return; } if(e.target.closest('figure.on')) openLb(imgs,i); });
  if(imgs.length<2){ $('#galP').disabled=true; $('#galN').disabled=true; }
  let sx=0,sy=0,sw=false;
  stage.addEventListener('pointerdown',e=>{ sx=e.clientX; sy=e.clientY; sw=true; });
  stage.addEventListener('pointerup',e=>{
    if(!sw) return; sw=false;
    const dx=e.clientX-sx, dy=e.clientY-sy;
    if(Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)){ swiped=true; dx<0?show(i+1,'next'):show(i-1,'prev'); setTimeout(()=>swiped=false,350); }
  });
  gal={stage,show,get i(){return i}};
}

let lbSet=[],lbI=0,lbLast=null,lbSync=true;
const lb=$('#lb'), lbStage=$('#lbStage');
function openLb(set,i,sync=true){
  lbSet=set; lbI=i; lbLast=document.activeElement; lbSync=sync;
  lbStage.innerHTML=set.map((s,k)=>`<figure class="${k===i?'on':''}"><img ${k===i?`src="${s}"`:`data-src="${s}"`} alt="Imagem ${k+1} de ${set.length}" draggable="false"></figure>`).join('');
  lb.classList.add('on'); lb.setAttribute('aria-hidden','false'); document.body.classList.add('lock');
  paintLb(); $('#lbX').focus();
}
function paintLb(dir){
  const fg=$$('figure',lbStage);
  lb.dataset.dir=dir||'next';
  const load=k=>{ const im=$('img',fg[k]); if(im&&!im.src&&im.dataset.src) im.src=im.dataset.src; };
  load(lbI); if(lbSet.length>1){ load((lbI+1)%lbSet.length); load((lbI-1+lbSet.length)%lbSet.length); }
  fg.forEach((f,k)=>{
    if(k===lbI){ f.classList.remove('out'); void f.offsetWidth; f.classList.add('on'); }
    else if(f.classList.contains('on')){ f.classList.remove('on'); f.classList.add('out'); }
    else f.classList.remove('out');
  });
  $('#lbC').textContent=`${pad2(lbI+1)} / ${pad2(lbSet.length)}`;
  if(gal&&lbSync) gal.show(lbI);
  const nv=lbSet.length>1; $('#lbP').style.display=nv?'':'none'; $('#lbN').style.display=nv?'':'none';
}
function closeLb(){ lb.classList.remove('on'); lb.setAttribute('aria-hidden','true'); document.body.classList.remove('lock'); if(lbLast&&lbLast.focus) lbLast.focus(); }
$('#lbX').onclick=closeLb;
$('#lbP').onclick=()=>{ lbI=(lbI-1+lbSet.length)%lbSet.length; paintLb('prev'); };
$('#lbN').onclick=()=>{ lbI=(lbI+1)%lbSet.length; paintLb('next'); };
lb.addEventListener('click',e=>{ if(e.target===lb||e.target===lbStage) closeLb(); });
(function(){ let sx=0,sy=0,sw=false;
  lbStage.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY;sw=true});
  lbStage.addEventListener('pointerup',e=>{ if(!sw) return; sw=false; const dx=e.clientX-sx,dy=e.clientY-sy;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)) (dx<0?$('#lbN'):$('#lbP')).click(); });
})();
addEventListener('keydown',e=>{
  if(lb.classList.contains('on')){
    if(e.key==='Escape') closeLb();
    if(e.key==='ArrowLeft') $('#lbP').click();
    if(e.key==='ArrowRight') $('#lbN').click();
    if(e.key==='Tab'){
      const f=$$('#lb button'); const first=f[0], last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey&&document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
    return;
  }
  if(gal && (e.key==='ArrowLeft'||e.key==='ArrowRight') && $('.page[data-page="projeto"]').classList.contains('on')){
    const r=gal.stage.getBoundingClientRect();
    if(r.bottom>0 && r.top<innerHeight){ e.preventDefault(); e.key==='ArrowLeft'?gal.show(gal.i-1,'prev'):gal.show(gal.i+1,'next'); }
  }
});

const T_FECHA = 1050;   // painéis sobem + marca aparece, e então troca a página
/* T_LIMPA precisa ser >= T_FECHA + 90 + (atraso do último painel) + (duração da saída)
   = 1050 + 90 + 280 + 720 = 2140ms. Se for menor, a classe .out sai antes do 5º painel
   terminar, o transform-origin volta de 'top' para 'bottom' no meio do movimento e
   fica aquela faixa sobrando na tela. */
const T_LIMPA = 2250;   // quando a cortina termina de sair
const curtain=$('#curtain');

function route(){
  const h = location.hash.replace('#/','') || '';
  const [page,slug] = h.split('/');
  const target = page==='' ? 'home' : page;
  if(target!=='projeto') gal=null;
  if(target==='projeto') renderProject(slug);
  $$('.page').forEach(pg=>pg.classList.toggle('on',pg.dataset.page===target));
  $$('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.route===target));
  /* páginas que abrem em fundo claro: o header troca para grafite */
  document.body.dataset.topo = (target==='projetos'||target==='contato') ? 'claro' : 'escuro';
  scrollTo(0,0);
  scan($(`.page[data-page="${target}"]`));
  const nome = target==='projeto' ? (PROJECTS.find(p=>p.slug===slug)||{}).title
             : target==='home' ? null : target[0].toUpperCase()+target.slice(1);
  document.title = nome ? 'PLATINUM | '+nome : 'PLATINUM | Arquitetura e Engenharia';
}

let navegando=false;
function nav(){
  if(reduce){ route(); return; }
  if(navegando) return; navegando=true;
  curtain.classList.remove('out'); curtain.classList.add('in');
  setTimeout(route, T_FECHA);
  setTimeout(()=>{ curtain.classList.remove('in'); curtain.classList.add('out'); }, T_FECHA+90);
  setTimeout(()=>{ curtain.classList.remove('out'); navegando=false; }, T_LIMPA);
}
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-link]'); if(!a) return;
  e.preventDefault(); closeMenu();
  const to=a.getAttribute('href');
  if(to===location.hash){ scrollTo({top:0,behavior:'smooth'}); return; }
  history.pushState(null,'',to); nav();
});
addEventListener('popstate',nav);
route();

$('#yr').textContent=new Date().getFullYear();