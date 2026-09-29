/* ============================================================
   PLANTA DA PENTHOUSE — desenho em linhas
   Coordenadas no mesmo sistema da imagem real (550 x 807 px),
   então o traço e a foto (img/obra/planta-real.webp) se sobrepõem 1:1.
   Cada grupo (g) entra em uma etapa da animação; ver js/obra.js.
   ============================================================ */
window.PLANTA = (()=>{
/* ROT = 0 deixa a planta em pé, igual à imagem real (varanda em cima, Rua 120 embaixo).
   90 / -90 deitam o desenho, se um dia precisar. */
const ROT = 0;
const out = {walls:[], glass:[], fix:[], furn:[], soft:[], text:[]};
const R  = (x,y,w,h,rx=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${rx?` rx="${rx}"`:''} pathLength="1"/>`;
const L  = (x1,y1,x2,y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" pathLength="1"/>`;
const C  = (cx,cy,r) => `<circle cx="${cx}" cy="${cy}" r="${r}" pathLength="1"/>`;
const E  = (cx,cy,rx,ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" pathLength="1"/>`;
const P  = d => `<path d="${d}" pathLength="1"/>`;
const G  = (tr,inner) => `<g transform="${tr}">${inner}</g>`;

/* ---------- peças que se repetem ---------- */
const vaso   = (x,y,r=1)=> G(`translate(${x} ${y}) rotate(${r})`, E(0,-1,4.6,5.4)+R(-5.5,4,11,3.6,1));
const ralo   = (x,y)=> C(x,y,2.6)+C(x,y,.9);
const cuba   = (x,y,w,h)=> R(x,y,w,h,1.5)+E(x+w/2,y+h/2,w*.3,h*.28);
const cabide = (x,y,w,h,step=3.2,vertical=false)=>{
  let s=R(x,y,w,h);
  if(!vertical){ for(let k=x+step;k<x+w-1;k+=step) s+=L(k,y+2,k,y+h-2); s+=L(x+1.5,y+h/2,x+w-1.5,y+h/2); }
  else         { for(let k=y+step;k<y+h-1;k+=step) s+=L(x+2,k,x+w-2,k); s+=L(x+w/2,y+1.5,x+w/2,y+h-1.5); }
  return s;
};
const palmeira = (x,y,s=1)=>{
  let d=''; for(let i=0;i<7;i++){ const a=i/7*Math.PI*2+.3, r=11*s, b=a+.32, c=a-.32;
    d+=`M${x} ${y}Q${(x+Math.cos(b)*r*.6).toFixed(1)} ${(y+Math.sin(b)*r*.6).toFixed(1)} ${(x+Math.cos(a)*r).toFixed(1)} ${(y+Math.sin(a)*r).toFixed(1)}Q${(x+Math.cos(c)*r*.6).toFixed(1)} ${(y+Math.sin(c)*r*.6).toFixed(1)} ${x} ${y}`; }
  return P(d)+C(x,y,1.4);
};
const moita = (x,y,r)=>{
  let d=`M${x+r} ${y}`; const n=9;
  for(let i=1;i<=n;i++){ const a=i/n*Math.PI*2, m=(i-.5)/n*Math.PI*2;
    d+=`Q${(x+Math.cos(m)*r*1.28).toFixed(1)} ${(y+Math.sin(m)*r*1.28).toFixed(1)} ${(x+Math.cos(a)*r).toFixed(1)} ${(y+Math.sin(a)*r).toFixed(1)}`; }
  return P(d+'Z')+C(x,y,r*.35);
};
const cadeira = (x,y,w,h)=> R(x,y,w,h,2)+R(x+2,y+2,w-4,h-4,1.5);
const banco   = (x,y,w,h)=> R(x,y,w,h,1.2);

/* ============================================================
   1. ESTRUTURA — paredes, pilares, núcleo
   ============================================================ */
out.walls.push(
  // contorno: orelhas da varanda + fachada
  R(20,13,48,3), R(65,13,3,37), R(68,47,418,3), R(486,13,3,37), R(486,13,46,3), R(529,13,3,183), R(515,193,17,3),
  R(20,13,3,457), R(15,470,10,55), R(28,525,3,210), R(28,732,205,3),
  R(273,730,245,3), R(515,133,3,600), R(513,500,10,25),
  // núcleo: escada
  R(190,183,155,5), R(190,183,5,120), R(338,183,7,95), R(330,287,5,30),
  R(205,298,55,5), R(262,298,38,5), R(300,298,5,20),
  // elevadores e shafts
  R(205,330,57,55), R(205,385,57,55), R(300,385,37,55),
  R(205,495,63,65), R(272,495,63,65), R(190,490,15,70), R(335,480,10,80),
  R(172,385,6,72), R(177,385,28,4), R(173,440,32,3), R(197,303,6,137),
  R(328,280,14,107), R(330,453,10,40),
  // divisas dos quartos
  R(340,133,5,111), R(340,265,5,13), R(345,278,75,4), R(420,157,5,125), R(425,193,90,4), R(425,232,5,5), R(452,232,63,5),
  R(437,322,78,5), R(377,305,5,142), R(400,403,115,5), R(400,431,5,19),
  R(377,448,138,5), R(377,498,20,5), R(419,498,96,5), R(372,453,5,86), R(372,561,5,172),
  // bwc da área de serviço
  R(101,160,4,24),
  // lavabo: parede de cima + parede da direita com o vão da porta (y 527–545)
  R(25,517,91,4), R(112,521,4,6), R(112,545,4,8),
  // hall de entrada (Rua 120)
  R(233,668,40,65), R(240,738,14,30), R(258,738,14,30), R(273,673,3,24)
);
out.glass.push(
  // pano de vidro entre varanda e interior
  L(23,130,515,130), L(23,134,515,134),
  ...[23,68,120,180,230,290,340,383,425,470,515].map(x=>L(x,130,x,134)),
  // vidros de box
  L(50,135,50,185), L(490,134,490,180), L(490,197,490,228), L(482,408,482,450),
  // portas de correr
  R(346,197,3,32), R(467,235,33,3), R(478,408,32,3),
  L(342,450,365,450)
);


/* PORTAS: cada porta é uma abertura (vão) na parede — sem folha nem arco.
   Os vãos ficam nas paredes acima: suíte 13,15, BWC 3,70, BWC 4,30, BWC 6,40,
   suíte máster e lavabo têm a parede partida em dois pedaços. */

/* ============================================================
   2. BANHEIROS E BANCADAS
   ============================================================ */
out.fix.push(
  // BWC 4,40
  ralo(37,171), G('translate(63 172)',E(0,0,5.5,6.5)+R(-6,6,12,5,1)), R(50,183,60,7), cuba(80,170,16,12),
  ...[56,66,86,96].map(x=>R(x,190,8,13,1)),
  // área de serviço
  R(110,163,26,37), R(118,170,9,8), R(118,188,9,8),
  // BWC 5,10 e 3,70
  R(430,181,85,5), cuba(431,170,16,11), G('translate(473 172)',E(0,0,5.5,6.2)+R(-6,6,12,4,1)), ralo(503,172),
  cuba(430,197,17,10), G('translate(477 205)',E(0,0,5.5,6)+R(-6,-10,12,4,1)), ralo(502,206),
  // BWC 4,30
  R(407,437,33,11), cuba(412,438,14,9), vaso(463,440), ralo(498,441),
  // BWC 6,40
  R(380,458,12,34), E(386,475,4,7), vaso(425,463,180), ralo(447,466),
  R(463,464,47,27,13), R(467,468,39,19,9),
  // cozinha
  R(22,303,18,114), R(27,322,13,21), C(30.5,327.5,2.4), C(36.5,327.5,2.4), C(30.5,337.5,2.4), C(36.5,337.5,2.4),
  cuba(26,372,13,14), R(22,403,105,14), C(33,410,2), C(47,410,2),
  R(25,252,115,6), R(62,256,57,24), L(90.5,256,90.5,280),
  R(173,183,19,72), R(177,198,11,12), R(177,222,11,10),
  // ilha
  R(72,322,58,76), G('translate(85 363)',R(-6,-7,12,14)+C(-2.5,-2.5,1.6)+C(2.5,-2.5,1.6)+C(-2.5,2.5,1.6)+C(2.5,2.5,1.6)),
  // lavabo
  R(63,545,40,8), cuba(76,543,14,9),
  // espaço gourmet
  R(28,550,87,17), R(30,567,85,16), R(175,620,35,100), R(195,642,11,21), L(195,652.5,206,652.5),
  C(200,700,4), L(194,700,206,700), L(200,694,200,706),
  // piscina
  R(50,652,68,81), R(53,658,64,67),
  P('M58 675q7-4 14 0t14 0t14 0t14 0M58 690q7-4 14 0t14 0t14 0t14 0M58 705q7-4 14 0t14 0t14 0t14 0')
);

/* ============================================================
   3. MOBILIÁRIO
   ============================================================ */
out.furn.push(
  // varanda
  C(171,116,8), C(171,116,4), R(185,100,55,27,2), R(200,101,39,9,2), R(186,110,13,16,2), C(252,118,5),
  C(457,106,17), C(457,106,12), P('M446 117q11 7 22 0'),
  // área de serviço / dependência
  cabide(25,187,25,13), cabide(25,236,115,16,3.6),
  R(270,136,65,26,2), R(320,139,12,20,2), L(292,136,292,162), cabide(232,176,83,14,3.6),
  R(203,134,4,23),
  // escada (degraus)
  R(205,195,130,103), R(240,232,58,30), R(247,237,46,20),
  ...Array.from({length:12},(_,i)=>L(247+i*7.5,195,247+i*7.5,232)),
  ...Array.from({length:12},(_,i)=>L(247+i*7.5,262,247+i*7.5,298)),
  // suíte 13,15
  G('rotate(-8 370 162)',R(356,150,30,24,4)+R(360,153,22,6,2)), R(353,170,52,90), R(360,190,40,62,2),
  R(400,190,18,40,3), L(360,212,400,212), R(406,167,13,19,1.5), R(406,237,13,19,1.5), C(412,176,3), C(412,246,3),
  cabide(369,261,51,15,3.6),
  // suíte 11,45
  R(435,255,80,62), R(452,266,45,49,2), R(456,300,37,14,2), L(452,284,497,284),
  R(440,317,72,6), C(446,315,5.2), C(446,315,2.5), C(506,315,5.2), C(506,315,2.5),
  cabide(370,307,67,15,3.6), R(388,310,10,10),
  // suíte 13,95
  R(438,330,77,70), R(452,340,48,50,2), R(456,344,40,12,2), L(452,366,500,366),
  C(446,337,5.2), C(446,337,2.5), C(506,337,5.2), C(506,337,2.5),
  cabide(380,330,57,10,3.6), cabide(378,340,15,47,3.6,true),
  // suíte máster
  cabide(420,503,95,14,3.6), cabide(380,505,13,28,3.6,true),
  R(422,540,85,20,2), R(427,572,15,13,1.5), R(488,572,15,13,1.5), R(440,568,48,6,1.5),
  R(440,574,48,56,2), R(445,578,17,8,2), R(466,578,17,8,2), L(440,602,488,602),
  R(428,590,80,55), R(490,650,21,20), C(476,675,4.5),
  G('rotate(28 454 689)',R(443,678,22,22,3)+L(446,685,462,685)+L(446,690,462,690)+L(446,695,462,695)),
  G('rotate(-24 486 711)',R(472,697,28,28,3)+L(475,705,497,705)+L(475,711,497,711)+L(475,717,497,717)),
  // home theater
  R(342,597,31,126,3), R(362,597,11,126,2), L(342,628,362,628), L(342,660,362,660), L(342,692,362,692),
  ...[590,620,680,710].map(y=>C(383,y,2)),
  R(300,610,28,35,2), R(306,615,16,25), C(314,627,4),
  G('rotate(-10 299 703)',R(286,690,27,27,5)+R(290,692,19,8,3)), C(322,702,6),
  // cozinha: banquetas e jantar
  ...[[95,315],[112,315]].map(([x,y])=>banco(x,y,12,8)),
  ...[330,348,365,382].map(y=>banco(130,y,8,11)),
  R(45,443,80,47,2),
  ...[50,70,90,110].map(x=>cadeira(x,432,13,12)), ...[50,70,90,110].map(x=>cadeira(x,488,13,12)),
  cadeira(34,449,12,13), cadeira(34,470,12,13), cadeira(124,449,12,13), cadeira(124,470,12,13),
  // gourmet
  ...Array.from({length:9},(_,i)=>C(37+i*9.5,575,2)),
  R(50,590,98,57), C(52,601,4),
  G('rotate(22 57 628)',R(35,614,46,28,13)+R(40,618,14,20,6)),
  G('translate(100 612)',R(-6,-8,12,15,3)+R(-4,-6,8,4,1.5)),
  ...[643,661,679,697].map(y=>banco(167,y,9,9)),
  R(28,650,18,19), R(133,715,17,15,1.5), C(141,722,1.2),
  R(238,672,30,26), R(238,702,30,28)
);
out.soft.push(
  palmeira(40,40), palmeira(40,67,.95), moita(39,92,7), moita(40,111,5.5),
  palmeira(516,42), palmeira(515,68,.95), moita(514,91,7), moita(515,112,5.5),
  moita(319,119,8), moita(343,119,8), palmeira(430,118,.8),
  palmeira(110,360,.65), palmeira(89,466,.7), moita(263,649,9.5), palmeira(314,627,.4),
  // jardim vertical
  P('M31 674v58M37 674v58M43 674v58M48 674v58'),
  P('M31 684l6-4 6 4 5-4M31 700l6-4 6 4 5-4M31 716l6-4 6 4 5-4')
);

/* ============================================================
   4. AMBIENTES E ÁREAS — exatamente como na planta original
   ============================================================ */
/* textos: o desenho gira 90°, mas cada nome é desgirado no próprio lugar
   para continuar sendo lido na horizontal */
const up = (x,y,inner,ang=-ROT)=> ang ? `<g transform="rotate(${ang} ${x} ${y})">${inner}</g>` : inner;
const T=(n,a,x,y,lh=13.5)=>{
  const lines=n.split('\n'), yc=y+(lines.length*lh)/2-lh*.35;
  let s=lines.map((l,i)=>`<text class="nm" x="${x}" y="${y+i*lh}">${l}</text>`).join('');
  s+=`<text class="ar" x="${x}" y="${y+lines.length*lh}">${a}<tspan dy="-4.2" font-size="7.2">2</tspan></text>`;
  return `<g class="lb">${up(x,yc,s)}</g>`;
};
out.text.push(
  T('VARANDA','49,75m',265,81), T('BWC','4,40m',78,151), T('DEP.','8,45m',240,156),
  T('BWC','5,10m',457,148), T('Á. SERV.','18,25m',131,215), T('BWC','3,70m',456,215),
  T('SUÍTE','13,15m',380,245), T('COZINHA','29,30m',99,292), T('SUÍTE','11,45m',410,294),
  T('SUÍTE','13,95m',415,367), T('CIRC.','10,75m',355,418), T('BWC','4,30m',448,423),
  T('BWC','6,40m',436,480), T('SALA JANTAR','23,85m',163,517), T('LAV.','2,95m',52,531,11),
  T('ESPAÇO\nGOURMET','42,80m',195,589), T('HOME\nTHEATER','18,90m',306,660), T('SUÍTE MÁSTER','33,10m',432,660),
  `<g class="lb rua">${up(267,799,'<text x="267" y="804">RUA 120</text>',ROT===90?180:0)}</g>`,
  `<g class="lb norte">${C(448,788,18)}${up(481,801,'<text x="481" y="805">N</text>')}</g>`
);

const g = (k,cls)=>`<g class="pl-g ${cls}" data-g="${k}">${out[k].join('')}</g>`;
const body = `${g('walls','pl-walls')}${g('glass','pl-glass')}${g('fix','pl-fix')}${g('furn','pl-furn')}${g('soft','pl-soft')}${g('text','pl-text')}`;
/* viewBox justo ao desenho (sem a margem vazia da imagem) para a planta ficar maior */
const vb = ROT===90 ? [-3,10,802,527] : ROT===-90 ? [8,13,802,527] : [8,6,532,808];
const tr = ROT===90 ? 'translate(807 0) rotate(90)' : ROT===-90 ? 'translate(0 550) rotate(-90)' : '';
return `<svg class="pl-svg" viewBox="${vb.join(' ')}" data-w="${vb[2]}" data-h="${vb[3]}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Planta da Penthouse desenhada em linhas">
<g transform="${tr}">${body}</g>
</svg>`;
})();
