/* ------------------------------------------------------------
   PROJETOS EM DESTAQUE NA HOME — seis slugs, em dois grupos de três.
   Grupo 1: o 1º é o principal (grande, à esquerda); 2º e 3º à direita.
   Grupo 2: o 6º é o principal (grande, à direita); 4º e 5º à esquerda.
   ------------------------------------------------------------ */
const HOME_FEATURED = [
  "louvre-home-flats",
  "sense-mare",
  "legacy",
  "manhattan-flats",
  "yangzhou",
  "obelisco-skyhomes",
];

/* ------------------------------------------------------------
   Campos de cada projeto

   AS TRÊS IMAGENS SÃO INDEPENDENTES:
   cover         : imagem do CARD no mosaico (home e página Projetos)
   heroImage     : imagem do TOPO da página do projeto (.p-hero)
                   null = repete a capa. Ex.: '/img/legacy/03.webp'
   mediaImage    : imagem da coluna direita da seção "O projeto"
                   null = usa a 1ª da galeria. Ignorada quando há vídeo.

   coverPosition : object-position da capa nos cards (ex.: 'center',
                   'center 30%', 'center top'). Útil para renders
                   verticais que não podem ter a torre cortada.
   heroPosition  : mesmo enquadramento, só que para o topo da página.
                   null = usa o coverPosition.
   video         : caminho do vídeo do empreendimento (mp4/webm) ou null
   videoPoster   : imagem de poster do vídeo ou null
   Enquanto video for null, a página usa gallery[0] (ou a capa) no lugar.

   plantas       : lista de plantas internas, na seção "Plantas" (abaixo da galeria).
                   Cada uma: { nome, info, img }
                     nome : aba/título  (ex.: 'Penthouse', 'Tipo 01', 'Garden')
                     info : linha de apoio (ex.: '4 suítes · 342,60 m² privativos')
                     img  : arquivo da planta (webp ou png)
                   Lista vazia [] = a seção não aparece nesse projeto.
                   Resolução: 2000 px no lado maior, para o zoom ficar nítido.
   ------------------------------------------------------------ */
const PROJECTS = [
  {
    slug: "obelisco-skyhomes",
    title: "Obelisco Skyhomes",
    cat: "Residencial",
    cidade: "Itapema",
    endereco: "Esquina com a Rua 126",
    area: "17.056,18 m²",
    unidades: "49 unidades",
    span: "c-4 r-tall",
    coverPosition: "center 40%",
    cover: "/img/obelisco-skyhomes/capa.webp",
    heroImage: null,
    heroPosition: null,
    mediaImage: "/img/obelisco-skyhomes/01.webp",
    gallery: [
      "/img/obelisco-skyhomes/01.webp",
      "/img/obelisco-skyhomes/02.webp",
      "/img/obelisco-skyhomes/03.webp",
      "/img/obelisco-skyhomes/04.webp",
      "/img/obelisco-skyhomes/05.webp",
      "/img/obelisco-skyhomes/06.webp",
      "/img/obelisco-skyhomes/07.webp",
      "/img/obelisco-skyhomes/08.webp",
      "/img/obelisco-skyhomes/09.webp",
    ],
    intro:
      "Edifício residencial em Itapema, com 17.056,18 m² de área e 49 unidades.",
    texto: [], 
    video: null,
    videoPoster: null,
    plantas: [
      { nome: "Duplex Inferior",  info: "5 suítes (3 master) · 319,40 m²", img: "/img/obelisco-skyhomes/plantas/duplex-inferior.webp" },
      { nome: "Duplex Superior",  info: "5 suítes (3 master) · 319,40 m²", img: "/img/obelisco-skyhomes/plantas/duplex-superior.webp" },
      { nome: "Penthouse",        info: "5 suítes (4 master) · 317,58 m²", img: "/img/obelisco-skyhomes/plantas/penthouse.webp" },
    ],
  },
  {
    slug: "legacy",
    title: "Legacy",
    cat: "Residencial",
    cidade: "Itapema",
    endereco: "Rua 120, 124",
    area: "22.025,30 m²",
    unidades: "51 unidades",
    span: "c-5 r-mid",
    coverPosition: "center",
    cover: "/img/legacy/capa.webp",
    heroImage: "/img/legacy/03.webp",
    heroPosition: null,
    mediaImage: null,
    gallery: [
      "/img/legacy/01.webp",
      "/img/legacy/02.webp",
      "/img/legacy/03.webp",
      "/img/legacy/04.webp",
      "/img/legacy/05.webp",
      "/img/legacy/06.webp",
      "/img/legacy/07.webp",
      "/img/legacy/08.webp",
      "/img/legacy/09.webp",
      "/img/legacy/10.webp",
      "/img/legacy/11.webp",
    ],
    intro:
      "Edifício residencial em Itapema, com 22.025,30 m² de área e 51 unidades.",
    texto: [], 
    video: "/img/legacy/video.mp4",
    videoPoster: "/img/legacy/video-poster.webp",
    plantas: [
      { nome: "Tipo 01",                info: "188,95 m² privativos · 4 suítes",   img: "/img/legacy/plantas/tipo-01.webp" },
      { nome: "Tipo 02",                info: "192,55 m² privativos · 4 suítes",   img: "/img/legacy/plantas/tipo-02.webp" },
      { nome: "Duplex 01",              info: "320,90 m² privativos · 5 suítes",   img: "/img/legacy/plantas/duplex-01.webp" },
      { nome: "Duplex 02",              info: "325,70 m² privativos · 5 suítes",   img: "/img/legacy/plantas/duplex-02.webp" },
      { nome: "Duplex Diferenciado",    info: "340,90 m² privativos · 5 suítes",   img: "/img/legacy/plantas/duplex-diferenciado.webp" },
      { nome: "Penthouse D",            info: "297,10 m² privativos · 4 suítes",   img: "/img/legacy/plantas/penthouse-d.webp" },
      { nome: "Penthouse E",            info: "297,10 m² privativos · 4 suítes",   img: "/img/legacy/plantas/penthouse-e.webp" },
      { nome: "Penthouse X",            info: "288,30 m² privativos · 4 suítes",   img: "/img/legacy/plantas/penthouse-x.webp" },
      { nome: "Penthouse Diferenciado", info: "342,60 m² privativos · 4 suítes",   img: "/img/legacy/plantas/penthouse-diferenciado.webp" },
      { nome: "Lazer · 7º andar",       info: "1.200 m² de lazer · 18 ambientes",  img: "/img/legacy/plantas/lazer-7-andar.webp" },
      { nome: "Rooftop · 1º piso",      info: "Legacy Lounge, adega e sport bar",  img: "/img/legacy/plantas/rooftop-1.webp" },
      { nome: "Rooftop · 2º piso",      info: "Dois espaços gourmet",              img: "/img/legacy/plantas/rooftop-2.webp" },
    ],
  },
  {
    slug: "louvre-home-flats",
    title: "Louvre Home Flats",
    cat: "Flats",
    cidade: "Porto Belo",
    endereco: "Rua Angélica Albano com Rua Luiz Scaburi, Jardim Villanova II",
    area: "14.549,67 m²",
    unidades: "355 unidades",
    span: "c-5 r-tall",
    coverPosition: "center 40%",
    cover: "/img/louvre-home-flats/capa.webp",
    heroImage: "/img/louvre-home-flats/01.webp",
    heroPosition: null,
    mediaImage: "/img/louvre-home-flats/04.webp",
    gallery: [
      "/img/louvre-home-flats/01.webp",
      "/img/louvre-home-flats/02.webp",
      "/img/louvre-home-flats/03.webp",
      "/img/louvre-home-flats/04.webp",
      "/img/louvre-home-flats/05.webp",
      "/img/louvre-home-flats/06.webp",
      "/img/louvre-home-flats/07.webp",
    ],
    intro:
      "Edifício de flats em Porto Belo, com 14.549,67 m² de área e 355 unidades.",
    texto: [], 
    video: null,
    videoPoster: null,
    plantas: [],
  },
  {
    slug: "yangzhou",
    title: "Yangzhou",
    cat: "Residencial",
    cidade: "Itapema",
    endereco: "2ª Avenida, esquina com Rua 300/302",
    area: "19.400,22 m²",
    unidades: "65 unidades",
    span: "c-8 r-wide",
    coverPosition: "center",
    cover: "/img/yangzhou/capa.webp",
    heroImage: "/img/yangzhou/03.webp",
    heroPosition: null,
    mediaImage: null,
    gallery: [
      "/img/yangzhou/01.webp",
      "/img/yangzhou/02.webp",
      "/img/yangzhou/03.webp",
      "/img/yangzhou/04.webp",
      "/img/yangzhou/05.webp",
      "/img/yangzhou/06.webp",
      "/img/yangzhou/07.webp",
      "/img/yangzhou/08.webp",
      "/img/yangzhou/09.webp",
    ],
    intro:
      "Edifício residencial em Itapema, com 19.400,22 m² de área e 65 unidades.",
    texto: [], 
    video: "/img/yangzhou/video.mp4",
    videoPoster: "/img/yangzhou/video-poster.webp",
    plantas: [
      { nome: "Tipo 01",           info: "Unidade residencial · 4 dormitórios · 173 m²", img: "/img/yangzhou/plantas/tipo-01.webp" },
      { nome: "Tipo 02",           info: "Unidade residencial · 3 dormitórios · 152 m²", img: "/img/yangzhou/plantas/tipo-02.webp" },
      { nome: "Lazer · 40º andar", info: "Área de lazer · 1.400 m²",                    img: "/img/yangzhou/plantas/lazer-40-andar.webp" },
    ],
  },
  {
    slug: "sense-mare",
    title: "Sense Mare",
    cat: "Residencial",
    cidade: "Itapema",
    endereco: "Rua 1100, nº 147, Ilhota",
    area: "33.654,27 m²",
    unidades: "259 unidades",
    span: "c-7 r-mid",
    coverPosition: "center",
    cover: "/img/sense-mare/capa.webp",
    heroImage: "/img/sense-mare/04.webp",
    heroPosition: null,
    mediaImage: null,
    gallery: [
      "/img/sense-mare/01.webp",
      "/img/sense-mare/02.webp",
      "/img/sense-mare/03.webp",
      "/img/sense-mare/04.webp",
    ],
    intro:
      "Edifício residencial em Itapema, com 33.654,27 m² de área e 259 unidades.",
    texto: [], // Texto autoral do projeto, caso exista
    video: null,
    videoPoster: null,
    plantas: [],
  },
  {
    slug: "manhattan-flats",
    title: "Manhattan Flats",
    cat: "Flats",
    cidade: "Itapema",
    endereco: "Rua 123",
    area: "17.015,48 m²",
    unidades: "153 unidades",
    span: "c-8 r-wide",
    coverPosition: "center",
    cover: "/img/manhattan-flats/capa.webp",
    heroImage: "/img/manhattan-flats/01.webp",
    heroPosition: null,
    mediaImage: null,
    gallery: [
      "/img/manhattan-flats/01.webp",
      "/img/manhattan-flats/02.webp",
      "/img/manhattan-flats/03.webp",
      "/img/manhattan-flats/04.webp",
      "/img/manhattan-flats/05.webp",
      "/img/manhattan-flats/06.webp",
    ],
    intro:
      "Edifício de flats em Itapema, com 17.015,48 m² de área e 153 unidades.",
    texto: [], 
    video: "/img/manhattan-flats/video.mp4",
    videoPoster: "/img/manhattan-flats/video-poster.webp",
    plantas: [
      { nome: "Térreo",                       info: "Boliche, bar inglês, restaurante, refeitório, vestiários e cozinha", img: "/img/manhattan-flats/plantas/terreo.webp" },
      { nome: "Lazer e Diferenciado",         info: "Pista de cooper, churrasqueira gourmet, playground e praça de fogo", img: "/img/manhattan-flats/plantas/lazer-diferenciado.webp" },
      { nome: "Tipos",                        info: "Modelo 01: 01 suíte e living · Modelo 02: 02 suítes",               img: "/img/manhattan-flats/plantas/tipos.webp" },
      { nome: "Lazer e Rooftop",              info: "Piscinas adulto e infantil, prainha, bar molhado, salão de festas, academia, auditório, bistrô, sala de jogos e sauna", img: "/img/manhattan-flats/plantas/lazer-rooftop.webp" },
    ],
  },
];


/* ------------------------------------------------------------
   CLIENTES — faixa da home, entre "Projetos em destaque" e "Tem um terreno".
   logo : ícone em SVG (só o símbolo, sem o nome — o nome vem escrito ao lado)
   mono : true = ícone de uma cor só; ele assume a cor do texto (fica certo no claro e no escuro)
   ar   : proporção largura/altura do SVG (só nos mono), para o ícone não deformar
   cor  : cor da marca que o ícone mono ganha no hover (sem cor = fica claro, como o texto)
   wm   : true = a logo já é o nome escrito; entra a logo inteira, sem o nome ao lado
   esc  : ajuste fino do tamanho de uma logo wm (1 = automático; 0.8 = menor, 1.3 = maior)
   A ordem aqui é a da 1ª linha; a 2ª linha começa do meio da lista e anda no sentido contrário.
   Para incluir mais um: salve o SVG em img/clientes/ e acrescente uma linha.
   ------------------------------------------------------------ */
const CLIENTES = [
  { nome: "Santana",           logo: "/img/clientes/santana.svg" },
  { nome: "Grupo N1",          logo: "/img/clientes/grupo-n1.svg" },
  { nome: "Pasqualotto",       logo: "/img/clientes/pasqualotto.svg" },
  { nome: "Coned",             logo: "/img/clientes/coned.svg" },
  { nome: "Macom",             logo: "/img/clientes/macom.svg", mono: true, ar: "611/638", cor: "#90bb54" },
  { nome: "Construcompany",    logo: "/img/clientes/construcompany.svg", mono: true, ar: "834/280", cor: "#cf1119" },
  { nome: "Netcorp",           logo: "/img/clientes/netcorp.svg", mono: true, ar: "558/624" },
  { nome: "JM",                logo: "/img/clientes/jm.svg", mono: true, ar: "608/578", cor: "#bc9d6a" },
  { nome: "Poti S/A",          logo: "/img/clientes/poti.svg",        mono: true, ar: "565/192" },
  { nome: "Meia Praia",        logo: "/img/clientes/meia-praia.svg", mono: true, ar: "708/378", cor: "#f17127" },
  { nome: "Selent & Anjos",    logo: "/img/clientes/selent-anjos.svg" },
  { nome: "AGV Selent",        logo: "/img/clientes/agv-selent.svg" },
  { nome: "Mètre",             logo: "/img/clientes/metre.svg",       mono: true, ar: "605/431" },
  { nome: "Excellence",        logo: "/img/clientes/excellence.svg", mono: true, ar: "708/664" },
  { nome: "Burini",            logo: "/img/clientes/burini.svg", mono: true, ar: "674/674", cor: "#c5ed2f" },
  { nome: "CBRL",              logo: "/img/clientes/cbrl.svg", mono: true, ar: "554/632", cor: "#b59463" },
  { nome: "VPR.M7",            logo: "/img/clientes/vpr-m7.svg", mono: true, ar: "678/518", cor: "#a17e19" },
  { nome: "Zanella",           logo: "/img/clientes/zanella.svg",     mono: true, ar: "436/442" },
  { nome: "Conrado",           logo: "/img/clientes/conrado.svg", mono: true, ar: "714/794", cor: "#faaf1d" },
  { nome: "Versatille",        logo: "/img/clientes/versatille.svg" },
  { nome: "Gandin",            logo: "/img/clientes/gandin.svg", mono: true, ar: "638/666", cor: "#6db5ce" },
  { nome: "HK Nove",           logo: "/img/clientes/hk-nove.svg", mono: true, ar: "656/656" },
  { nome: "AC Zanella",        logo: "/img/clientes/ac-zanella.svg", mono: true, ar: "440/608", cor: "#d0ae91" },
  { nome: "Maasef",            logo: "/img/clientes/maasef.svg", mono: true, ar: "686/557", cor: "#f4ab37" },
  { nome: "Branco",            logo: "/img/clientes/branco.svg", mono: true, ar: "536/737", cor: "#a0383b" },
  { nome: "RZilli",            logo: "/img/clientes/rzilli.svg", mono: true, ar: "520/677", cor: "#b00a28" },
  { nome: "Dallo",             logo: "/img/clientes/dallo.svg", mono: true, ar: "1601/408", cor: "#018e98", wm: true, esc: 0.82 },
  { nome: "JTA",               logo: "/img/clientes/jta.svg", mono: true, ar: "628/628", cor: "#8a3b59" },
  { nome: "C'Seger",           logo: "/img/clientes/c-seger.svg", mono: true, ar: "833/365", wm: true },
  { nome: "Tedesco",           logo: "/img/clientes/tedesco.svg" },
  { nome: "ARS Kammer",        logo: "/img/clientes/ars-kammer.svg", mono: true, ar: "707/308", wm: true },
  { nome: "Sunprime",          logo: "/img/clientes/sunprime.svg", mono: true, ar: "502/632" },
  { nome: "GDA",               logo: "/img/clientes/gda.svg", mono: true, ar: "356/698", cor: "#e8d27a" },
  { nome: "Zimmermann",        logo: "/img/clientes/zimmermann.svg", mono: true, ar: "413/638", cor: "#c4171c" },
  { nome: "Andorinha",         logo: "/img/clientes/andorinha.svg",   mono: true, ar: "526/521" },
  { nome: "Asael",             logo: "/img/clientes/asael.svg", mono: true, ar: "552/760", cor: "#e39c41" },
  { nome: "Feller",            logo: "/img/clientes/feller.svg", mono: true, ar: "716/632", cor: "#e5161d" },
  { nome: "Pessoa",            logo: "/img/clientes/pessoa.svg", mono: true, ar: "632/440", cor: "#4aaa8d" },
  { nome: "GR2",               logo: "/img/clientes/gr2.svg", mono: true, ar: "620/530", cor: "#896539" },
  { nome: "Vansin",            logo: "/img/clientes/vansin.svg", mono: true, ar: "512/638", cor: "#41b2ad" },
  { nome: "Espaço 3",          logo: "/img/clientes/espaco-3.svg", mono: true, ar: "614/620", cor: "#d77f28" },
  { nome: "Dalmolim & MCA",    logo: "/img/clientes/dalmolim-mca.svg", mono: true, ar: "470/652", cor: "#f16036" },
  { nome: "Impactos",          logo: "/img/clientes/impactos.svg", mono: true, ar: "646/569", cor: "#dcbc80" },
  { nome: "A. Vicente",        logo: "/img/clientes/a-vicente.svg", mono: true, ar: "652/638" },
  { nome: "Sampaio",           logo: "/img/clientes/sampaio.svg", mono: true, ar: "512/632", cor: "#d3bd65" },
  { nome: "Klein da Palma",    logo: "/img/clientes/klein-da-palma.svg", mono: true, ar: "383/638", cor: "#d80625" },
  { nome: "BSX",               logo: "/img/clientes/bsx.svg", mono: true, ar: "628/258", cor: "#265aa8", wm: true, esc: 0.8 },
  { nome: "AS Ramos",          logo: "/img/clientes/as-ramos.svg", mono: true, ar: "656/180", cor: "#c1a763", wm: true },
  { nome: "Justus",            logo: "/img/clientes/justus.svg", mono: true, ar: "736/407", wm: true, esc: 1.3 },
  { nome: "Arthen",            logo: "/img/clientes/arthen.svg", mono: true, ar: "679/727" },
  { nome: "Engeed",            logo: "/img/clientes/engeed.svg", mono: true, ar: "809/551" },
  { nome: "Cescon",            logo: "/img/clientes/cescon.svg", mono: true, ar: "629/395" },
  { nome: "MontClass",         logo: "/img/clientes/montclass.svg", mono: true, ar: "440/624" },
  { nome: "Pastório",          logo: "/img/clientes/pastorio.svg", mono: true, ar: "554/680" },
  { nome: "ProHouse",          logo: "/img/clientes/prohouse.svg", mono: true, ar: "1608/1103", cor: "#eb5d1a", wm: true },
  { nome: "Nostracon",         logo: "/img/clientes/nostracon.svg", mono: true, ar: "554/610", wm: true },
  { nome: "NH Empreendimentos", logo: "/img/clientes/nh-empreendimentos.svg", mono: true, ar: "796/802" },
  { nome: "IM7",               logo: "/img/clientes/im7.svg", mono: true, ar: "629/281", cor: "#f9e200", wm: true },
];


/* ------------------------------------------------------------
   ARTISTAS — marcações no banner "Arquitetura e música nos inspiram" (img/artistas-platinum.webp),
   no estilo das marcações do Instagram. A ordem é da esquerda para a direita.
   nome  : nome completo (aparece na marcação)      curto : nome curto, usado no celular
   grupo : dupla, se houver (aparece abaixo do nome) ig    : link do Instagram (sem link = marcação sem @)
   x, y  : centro do ROSTO na imagem, em % da largura e da altura (se trocar o banner, ajuste aqui)
   Para tirar uma marcação, apague a linha; para incluir a 3ª pessoa, preencha a linha comentada.
   ------------------------------------------------------------ */
const ARTISTAS = [
  { nome: "Dhonatan Coelho", curto: "Dhonatan",                                                                  x: 8.2,  y: 61 },
  { nome: "Maithan Mayer",   curto: "Maithan",                    ig: "https://www.instagram.com/maithanmayer/",   x: 16.6, y: 59 },
  // { nome: "",             curto: "",                           ig: "",                                          x: 22.6, y: 55 },
  { nome: "Ramon",           curto: "Ramon",   grupo: "Diego & Ramon",     ig: "https://www.instagram.com/diegoeramon/",       x: 28.2, y: 57 },
  { nome: "Luan Pereira",    curto: "Luan Pereira",                ig: "https://www.instagram.com/luanpereiracantor",  x: 39.4, y: 55 },
  { nome: "Bruno",           curto: "Bruno",   grupo: "Bruno & Marrone",   ig: "https://www.instagram.com/brunodobem/",        x: 50.2, y: 54 },
  { nome: "Ana Castela",     curto: "Ana Castela",                 ig: "https://www.instagram.com/anacastelacantora",  x: 58.2, y: 59 },
  { nome: "Benuto",          curto: "Benuto",  grupo: "Guilherme & Benuto", ig: "https://www.instagram.com/guilhermeebenuto/", x: 67.4, y: 55 },
  { nome: "Guilherme",       curto: "Guilherme", grupo: "Guilherme & Benuto", ig: "https://www.instagram.com/guilhermeebenuto/", x: 75.6, y: 59 },
  { nome: "Léo",             curto: "Léo",     grupo: "Léo & Raphael",     ig: "https://www.instagram.com/leoeraphael/",       x: 84.6, y: 56 },
  { nome: "Raphael",         curto: "Raphael", grupo: "Léo & Raphael",     ig: "https://www.instagram.com/leoeraphael/",       x: 92.6, y: 58 },
];
