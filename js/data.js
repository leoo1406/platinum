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
                   null = repete a capa. Ex.: 'img/legacy/03.webp'
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
    cover: "img/obelisco-skyhomes/capa.webp",
    heroImage: null,
    heroPosition: null,
    mediaImage: "img/obelisco-skyhomes/01.webp",
    gallery: [
      "img/obelisco-skyhomes/01.webp",
      "img/obelisco-skyhomes/02.webp",
      "img/obelisco-skyhomes/03.webp",
      "img/obelisco-skyhomes/04.webp",
      "img/obelisco-skyhomes/05.webp",
      "img/obelisco-skyhomes/06.webp",
      "img/obelisco-skyhomes/07.webp",
      "img/obelisco-skyhomes/08.webp",
      "img/obelisco-skyhomes/09.webp",
    ],
    intro:
      "Edifício residencial em Itapema, com 17.056,18 m² de área e 49 unidades.",
    texto: [], 
    video: null,
    videoPoster: null,
    plantas: [
      { nome: "Duplex Inferior",  info: "5 suítes (3 master) · 319,40 m²", img: "img/obelisco-skyhomes/plantas/duplex-inferior.webp" },
      { nome: "Duplex Superior",  info: "5 suítes (3 master) · 319,40 m²", img: "img/obelisco-skyhomes/plantas/duplex-superior.webp" },
      { nome: "Penthouse",        info: "5 suítes (4 master) · 317,58 m²", img: "img/obelisco-skyhomes/plantas/penthouse.webp" },
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
    cover: "img/legacy/capa.webp",
    heroImage: "img/legacy/03.webp",
    heroPosition: null,
    mediaImage: null,
    gallery: [
      "img/legacy/01.webp",
      "img/legacy/02.webp",
      "img/legacy/03.webp",
      "img/legacy/04.webp",
      "img/legacy/05.webp",
      "img/legacy/06.webp",
      "img/legacy/07.webp",
      "img/legacy/08.webp",
      "img/legacy/09.webp",
      "img/legacy/10.webp",
      "img/legacy/11.webp",
    ],
    intro:
      "Edifício residencial em Itapema, com 22.025,30 m² de área e 51 unidades.",
    texto: [], 
    video: "img/legacy/video.mp4",
    videoPoster: "img/legacy/video-poster.webp",
    plantas: [
      { nome: "Tipo 01",                info: "188,95 m² privativos · 4 suítes",   img: "img/legacy/plantas/tipo-01.webp" },
      { nome: "Tipo 02",                info: "192,55 m² privativos · 4 suítes",   img: "img/legacy/plantas/tipo-02.webp" },
      { nome: "Duplex 01",              info: "320,90 m² privativos · 5 suítes",   img: "img/legacy/plantas/duplex-01.webp" },
      { nome: "Duplex 02",              info: "325,70 m² privativos · 5 suítes",   img: "img/legacy/plantas/duplex-02.webp" },
      { nome: "Duplex Diferenciado",    info: "340,90 m² privativos · 5 suítes",   img: "img/legacy/plantas/duplex-diferenciado.webp" },
      { nome: "Penthouse D",            info: "297,10 m² privativos · 4 suítes",   img: "img/legacy/plantas/penthouse-d.webp" },
      { nome: "Penthouse E",            info: "297,10 m² privativos · 4 suítes",   img: "img/legacy/plantas/penthouse-e.webp" },
      { nome: "Penthouse X",            info: "288,30 m² privativos · 4 suítes",   img: "img/legacy/plantas/penthouse-x.webp" },
      { nome: "Penthouse Diferenciado", info: "342,60 m² privativos · 4 suítes",   img: "img/legacy/plantas/penthouse-diferenciado.webp" },
      { nome: "Lazer · 7º andar",       info: "1.200 m² de lazer · 18 ambientes",  img: "img/legacy/plantas/lazer-7-andar.webp" },
      { nome: "Rooftop · 1º piso",      info: "Legacy Lounge, adega e sport bar",  img: "img/legacy/plantas/rooftop-1.webp" },
      { nome: "Rooftop · 2º piso",      info: "Dois espaços gourmet",              img: "img/legacy/plantas/rooftop-2.webp" },
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
    cover: "img/louvre-home-flats/capa.webp",
    heroImage: "img/louvre-home-flats/01.webp",
    heroPosition: null,
    mediaImage: "img/louvre-home-flats/04.webp",
    gallery: [
      "img/louvre-home-flats/01.webp",
      "img/louvre-home-flats/02.webp",
      "img/louvre-home-flats/03.webp",
      "img/louvre-home-flats/04.webp",
      "img/louvre-home-flats/05.webp",
      "img/louvre-home-flats/06.webp",
      "img/louvre-home-flats/07.webp",
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
    cover: "img/yangzhou/capa.webp",
    heroImage: "img/yangzhou/03.webp",
    heroPosition: null,
    mediaImage: null,
    gallery: [
      "img/yangzhou/01.webp",
      "img/yangzhou/02.webp",
      "img/yangzhou/03.webp",
      "img/yangzhou/04.webp",
      "img/yangzhou/05.webp",
      "img/yangzhou/06.webp",
      "img/yangzhou/07.webp",
      "img/yangzhou/08.webp",
      "img/yangzhou/09.webp",
    ],
    intro:
      "Edifício residencial em Itapema, com 19.400,22 m² de área e 65 unidades.",
    texto: [], 
    video: "img/yangzhou/video.mp4",
    videoPoster: "img/yangzhou/video-poster.webp",
    plantas: [
      { nome: "Tipo 01",           info: "Unidade residencial · 4 dormitórios · 173 m²", img: "img/yangzhou/plantas/tipo-01.webp" },
      { nome: "Tipo 02",           info: "Unidade residencial · 3 dormitórios · 152 m²", img: "img/yangzhou/plantas/tipo-02.webp" },
      { nome: "Lazer · 40º andar", info: "Área de lazer · 1.400 m²",                    img: "img/yangzhou/plantas/lazer-40-andar.webp" },
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
    cover: "img/sense-mare/capa.webp",
    heroImage: "img/sense-mare/04.webp",
    heroPosition: null,
    mediaImage: null,
    gallery: [
      "img/sense-mare/01.webp",
      "img/sense-mare/02.webp",
      "img/sense-mare/03.webp",
      "img/sense-mare/04.webp",
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
    cover: "img/manhattan-flats/capa.webp",
    heroImage: "img/manhattan-flats/01.webp",
    heroPosition: null,
    mediaImage: null,
    gallery: [
      "img/manhattan-flats/01.webp",
      "img/manhattan-flats/02.webp",
      "img/manhattan-flats/03.webp",
      "img/manhattan-flats/04.webp",
      "img/manhattan-flats/05.webp",
      "img/manhattan-flats/06.webp",
    ],
    intro:
      "Edifício de flats em Itapema, com 17.015,48 m² de área e 153 unidades.",
    texto: [], 
    video: "img/manhattan-flats/video.mp4",
    videoPoster: "img/manhattan-flats/video-poster.webp",
    plantas: [
      { nome: "Térreo",                       info: "Boliche, bar inglês, restaurante, refeitório, vestiários e cozinha", img: "img/manhattan-flats/plantas/terreo.webp" },
      { nome: "Lazer e Diferenciado",         info: "Pista de cooper, churrasqueira gourmet, playground e praça de fogo", img: "img/manhattan-flats/plantas/lazer-diferenciado.webp" },
      { nome: "Tipos",                        info: "Modelo 01: 01 suíte e living · Modelo 02: 02 suítes",               img: "img/manhattan-flats/plantas/tipos.webp" },
      { nome: "Lazer e Rooftop",              info: "Piscinas adulto e infantil, prainha, bar molhado, salão de festas, academia, auditório, bistrô, sala de jogos e sauna", img: "img/manhattan-flats/plantas/lazer-rooftop.webp" },
    ],
  },
];
