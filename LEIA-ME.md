# PREMIUM — site

## Atualização — nova identidade (paleta, fontes, logo)

**Empreendimentos** — o site agora tem só 6: Obelisco Skyhomes, Legacy, Louvre Home Flats,
Yangzhou, Sense Mare e Manhattan Flats. Os outros saíram do `js/data.js` e as pastas de imagem
foram apagadas. As partes do site que usavam fotos de outros prédios (menu, diferenciais,
abertura do Estúdio, Contato) agora usam fotos desses seis.

**Cores** — bloco `:root` do `css/style.css`:

| variável | cor | uso |
|---|---|---|
| `--creme` | #F2EFE8 | fundo principal |
| `--linho` | #E2DCD0 | painéis, manifesto, galeria, cortina |
| `--areia` | #D0BFAB | destaque: botões, linhas, faixa das cidades |
| `--taupe` | #A39A8E | traços e texto secundário no escuro |
| `--grafite` | #32312F | texto e blocos escuros (hero, obra, chamada, menu, rodapé) |

Os blocos escuros trocam os papéis das cores na regra "TEMA ESCURO", logo abaixo do `:root`.
O cinza médio da paleta veio rotulado #E2DCD0 na imagem, mas a cor do bloco é #A39A8E — foi a usada.

**Fontes** — arquivos locais em `/fonts` (woff2, só os caracteres latinos):
Tenor Sans = títulos (`--f-title`), DM Sans = subtítulos e informações (`--f-sub`), Inter = corpo (`--f-body`).

**Logo** — `img/marca.png` é o PNG original (só a margem transparente foi cortada), usado no
carregamento e na cortina. No header e no rodapé a marca é o vetor `#logo` no topo do `index.html`:
mesma geometria, traço fixo de 1px, porque o PNG ficaria quase invisível a 40px.
A logo gira 90° no hover e na cortina. `img/favicon.svg` é a versão para a aba do navegador.

A animação da obra (`js/obra.js`) e a camada de luz `img/obra/torre-luz.webp` foram recoloridas
para a areia; o desenho de fundo do manifesto (`planta-linhas.svg`) agora é em grafite.

**Capas dos cards** — todas em **4:3, exportadas em 2000 × 1500 px** (webp, qualidade ~82).
O mesmo arquivo aparece inteiro no card grande, no pequeno, no tablet, no celular e em "Outros projetos".
No card grande do desktop a proporção é 1,32 em vez de 1,33: some cerca de 7px de cada lado, imperceptível.
Deixe o canto inferior esquerdo mais calmo (é onde fica o nome sobre o escurecimento) e uma folga de ~5%
nas bordas por causa do zoom do hover. O arquivo é o `cover` de cada projeto no `js/data.js`.

**Plantas (página do projeto)** — seção logo abaixo da galeria, com abas à esquerda e a planta
inteira à direita (nunca corta), com zoom: botões − 100% +, duplo clique, arrastar, pinça no
celular e Ctrl + rodinha no computador. O botão no canto superior direito abre em tela cheia.
O quadro se ajusta ao formato de cada planta (horizontal fica mais baixo). Quando a maioria
das plantas do projeto é horizontal, as abas vão para cima e a planta ocupa a largura toda. Preencha o campo `plantas` de cada
projeto no `js/data.js`: `{ nome, info, img }`. Lista vazia = a seção não aparece.
Exporte as plantas com 2000 px no lado maior para o zoom ficar nítido, só com o desenho
(sem título nem ficha técnica — essas informações já aparecem nas abas).

**Planta da animação da obra** — agora em pé, igual à imagem real, com textos maiores. As portas são
vãos abertos nas paredes (sem folha nem arco): para mudar um, ajuste os dois pedaços de parede em
volta dele no bloco "1. ESTRUTURA" do `js/planta.js`.
Os quatro números que ficavam embaixo da animação (Top 3, 25 anos...) foram removidos.

---

Estático puro (HTML + CSS + JS), sem build e sem dependência além do Google Fonts.
Conteúdo montado a partir do **Portfólio PREMIUM — 2025** (52 páginas, 6 projetos).

```
rs-concept/
├── index.html          markup das 5 páginas
├── css/style.css       estilo — variáveis no topo
├── js/data.js          os 6 projetos + mídia do escritório (é aqui que você edita conteúdo)
├── js/site.js          motor: roteador, animações, mosaico, diferenciais, galeria, tela cheia
└── img/                logo + 65 renders em webp
```

## Rodar

```bash
cd rs-concept
python3 -m http.server 8080     # http://localhost:8080
```

Abrir o `index.html` direto também funciona.

---

## Vídeos

Seis empreendimentos já estão com vídeo ligado: **Legacy, Manhattan Flats,
Aventador Beach, Fifty Six, Yangzhou e Mallory Square Residence**. O vídeo aparece
na coluna direita da seção "O projeto", sem áudio, em loop, com botão discreto de
pausar/reproduzir.

Para ligar o vídeo de mais um projeto, coloque o arquivo em `img/<slug>/video.mp4`,
gere um poster e preencha no `js/data.js`:

```js
video:'img/sense-mare/video.mp4',
videoPoster:'img/sense-mare/video-poster.webp'
```

Com `video:null`, a seção usa `gallery[0]` (ou a capa) e o layout fica idêntico.
Se o arquivo de vídeo não carregar, o poster continua no lugar.

**Vídeo do escritório (home)** — `js/data.js`, bloco `STUDIO_MEDIA`:

```js
const STUDIO_MEDIA = {
  type:'video',                       // 'image' ou 'video'
  src:'img/escritorio/obra.mp4',
  poster:'img/escritorio/obra.webp'
};
```

Hoje está em `type:'image'` com `img/number-one/02.webp`. Quando você tiver o vídeo
de obra, crie a pasta `img/escritorio/` e troque para `type:'video'`.

---

## Comprimindo novas imagens e vídeos

Os arquivos que você mandar em png/jpg precisam virar webp antes de entrar no site —
um png de 10 MB vira um webp de 240 KB sem diferença visível.

**Imagens** (ImageMagick ou o app que preferir). Regra usada aqui: no máximo
1700px no lado maior (2200px para as capas), qualidade 82.

```bash
magick entrada.png -resize 1700x1700\> -quality 82 saida.webp
```

**Vídeos** (ffmpeg). Regra usada aqui: 1280px de largura, 30fps, **sem faixa de
áudio** (o site nunca toca som) e CRF 28. Foi o que levou os 236 MB de vídeo para 42 MB.

```bash
ffmpeg -i entrada.mp4 -an -vf "scale='min(1280,iw)':-2,fps=30" \
       -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p \
       -movflags +faststart saida.mp4
```

Use sempre **mp4 (H.264)**: é o único formato que toca em todo iPhone, Android,
Chrome, Safari e Edge. CRF menor = mais qualidade e arquivo maior (23 a 30 é a faixa útil).

**Poster** — um quadro do próprio vídeo, escolhendo o segundo que ficar melhor:

```bash
ffmpeg -ss 14 -i video.mp4 -frames:v 1 -vf "scale='min(1700,iw)':-2" video-poster.webp
```

---

## Galerias

A galeria de cada projeto é a lista `gallery` no `data.js`, na ordem em que aparece.
A capa entra automaticamente como primeira imagem — não repita ela na lista.
Para acrescentar fotos novas: salve como `img/<slug>/11.webp`, `12.webp`… e
adicione o caminho no array.

## Outros campos editáveis

**Projetos da home** — `HOME_FEATURED` em `data.js`: seis slugs em dois grupos de três.
No 1º grupo o 1º slug é o projeto grande; no 2º grupo o 6º slug é o grande.

**As três imagens de cada projeto são independentes** — em `data.js`:

| campo | onde aparece | se ficar `null` |
|---|---|---|
| `cover` | card no mosaico (home e Projetos) | — |
| `heroImage` | topo da página do projeto (`.p-hero`) | repete a `cover` |
| `mediaImage` | coluna direita da seção "O projeto" | usa `gallery[0]` |

```js
cover:'img/aventador-beach/capa.webp',   // o card continua com a piscina
heroImage:'img/aventador-beach/03.webp', // o topo da página usa outro render
heroPosition:'center 35%',
mediaImage:'img/aventador-beach/05.webp',
```

`mediaImage` é ignorada quando o projeto tem `video` — nesse caso vale o `videoPoster`.
A galeria não muda: ela continua sendo `capa + gallery`, então se o render que você
usar no topo não estiver na `gallery`, ele não entra na galeria (e vice-versa).

**Enquadramento** — `coverPosition` vale para os cards e `heroPosition` para o topo
da página (`'center'`, `'center 30%'`, `'center top'`…). Vira `object-position`.
Útil para renders verticais que não podem ter a torre cortada. Com `heroPosition:null`
o topo herda o `coverPosition`.

**Texto autoral** — `texto:[]` em cada projeto. Enquanto vazio, a página mostra só
a introdução, sem frase de placeholder. Para preencher:

```js
texto:[
  'Primeiro parágrafo sobre o projeto.',
  'Segundo parágrafo.'
]
```

**Diferenciais** — direto no `index.html` (`#svcList`, dentro da `.svc`). São painéis lado a lado:
o aberto mostra o render do prédio com título e texto, os fechados mostram o losango e o título na vertical.
Passar o mouse, focar ou clicar abre; setas do teclado navegam. No celular vira uma pilha vertical.
O render aparece INTEIRO, na proporção original, sem corte: a altura dos painéis é calculada
(`diferenciais()` em `js/site.js`) para o prédio mais largo caber com o texto ao lado.
Para trocar a imagem de um painel, mude o `src` do `<img>` dentro de `.dif-media` e ajuste o
`style="--ar:0.8"` do `<article>` para a proporção da nova imagem (largura ÷ altura).
O painel aberto ao carregar é o que tem a classe `on`.
A proporção aberto/fechado é o `flex:6` de `.dif.on` no `css/style.css` (e `OPEN=6` no JS — mude os dois juntos).

**Contato** — telefones, Instagram e link do WhatsApp estão no `index.html`
(seção `.cta` da home, página Contato e menu). O botão "Conversar pelo WhatsApp"
usa a mesma mensagem pré-configurada do botão flutuante.

O campo `span` dos projetos não é mais usado (o mosaico monta os grupos sozinho);
ficou no arquivo por compatibilidade.

---

## O que veio do PDF

**Logo** — extraí o vetor rasterizado do próprio portfólio, em 3162px com transparência,
e gerei quatro versões: `logo-ouro.png`, `logo-branco.png` (lockup completo) e
`marca-ouro.png`, `marca-branca.png` (só o cubo). Se você tiver o SVG original, ele é melhor ainda.

**6 projetos** — endereço, área e número de unidades saíram do portfólio sem
nenhuma alteração. Categoria e cidade eu derivei: Residencial, Flats, Comercial
(Lotus Business) e Hotelaria (Hilton Garden Inn).

**65 renders** — extraídos das páginas e convertidos para webp. Capas em até 2200px,
galeria em até 1700px.

**Números e diferenciais** — os quatro números e os quatro diferenciais são
literalmente os das páginas 3 e 4 do portfólio.

---

## Pontos que precisam da sua atenção

**Fifty Six e Skyline** estão com endereço, área e nº de unidades idênticos no PDF
(3ª Avenida / Rua 286 / Rua 288 · 25.575,33 m² · 72 unidades). Vale confirmar.

**Charming Residence** — com as imagens novas a pasta ficou com 8 fotos. As duas
antigas (`01` e `02`) continuam em 715×901, a resolução original do PDF, e a capa
aparece em posição grande na página Projetos. Se houver um render maior, substitua
`capa.webp`.

**Quatro imagens repetidas** ficaram de fora da galeria para não aparecer o mesmo
render duas vezes seguidas (o arquivo continua na pasta, só não está no `data.js`):
`aventador-beach/07` (igual à capa), `fifty-six/02` (igual à 01),
`manhattan-flats/07` (igual à 02) e `urban-beach/05` (igual à 01).

**Grand Mirage** — a capa mostra a coroa do edifício com o letreiro da Klein Dapalma.
Se preferir outra imagem no card, troque a `capa.webp`.

**Não há dados de equipe nem endereço do escritório** no portfólio. Está só
"Itapema · Santa Catarina" no contato e no rodapé.

---

## Ajustes rápidos

**Velocidade dos números** — `js/site.js`, logo abaixo do comentário
"VELOCIDADE DOS NÚMEROS":

```js
const COUNT_MS   = 1400;   // quanto tempo cada número leva para chegar no valor final
const COUNT_STEP = 140;    // atraso entre um número e o próximo
```

Aumente `COUNT_MS` para uma contagem mais lenta, diminua para mais rápida.
Se mexer no `COUNT_STEP`, mexa junto no `--d` de `.stat:nth-child(1..4)` no CSS —
ele controla a linha dourada e a entrada do texto, e os dois precisam usar o mesmo ritmo
(hoje 0 / 140 / 280 / 420 ms).

**Busca dos projetos** — `js/site.js`, função `pintaProjetos()`. Ela procura em
nome, categoria, cidade e endereço, ignorando acento e caixa ("le reve" acha
"Le Rêve Flats"), e cada palavra digitada precisa bater — "hotelaria itapema"
devolve só o Hilton. Para incluir outro campo na busca, some ele à linha do
`norm(p.title+' '+p.cat+' '+...)`. A busca e os botões de tipo funcionam juntos.

**Velocidade da transição de página** — `js/site.js`, `T_FECHA` (1050ms) e `T_LIMPA` (2250ms).
As durações das faixas e da marca estão no CSS, em `#curtain`.

Cuidado com o `T_LIMPA`: ele precisa ser maior que
`T_FECHA + 90 + atraso do último painel (280ms) + duração da saída (720ms)` = 2140ms.
Se ficar menor, a classe `.out` sai antes do 5º painel terminar, o `transform-origin`
pula de `top` para `bottom` no meio do movimento e fica uma faixa sobrando na tela.
Se você acelerar as faixas no CSS, recalcule esse número.

**Cores, fundo da galeria e larguras da fonte** — bloco `:root` do `css/style.css`
(`--paper` é o fundo claro da galeria, `--paper-2` o tom neutro atrás dos renders).

**Duração da revelação diagonal** — `.diag` no CSS (1.1s); da troca de imagem dos
diferenciais — `.svc-img figure` (0.75s); da galeria — `.gal-track figure` (0.55s).

## Animações que se repetem

As revelações (títulos, imagens, linha e contagem dos números) acontecem toda vez que
o elemento entra na tela — se você rolar para baixo e voltar, elas rodam de novo.
Quem controla isso é o `IntersectionObserver` no `js/site.js`: o elemento ganha a classe
`rv` ao encostar na viewport e perde quando sai completamente dela.

O `rootMargin:'0px 0px -12% 0px'` é o quanto o elemento precisa subir na tela antes
de animar. Deixe mais negativo (`-20%`) para a animação começar mais tarde.

Para voltar ao comportamento de animar só uma vez, acrescente `io.unobserve(e.target)`
logo depois do `classList.add('rv')` e apague o `else` que remove a classe.

## Movimento reduzido

Com `prefers-reduced-motion` ativo tudo aparece imediatamente: sem contadores,
sem revelação de imagem, sem cortina de transição.

## Formulário

O site não tem formulário. O contato é por WhatsApp, telefone e Instagram.

---

## Correção — preenchimento dourado dos botões

O `.btn::before` (a faixa dourada que sobe no hover) estava em `z-index:-1`. Um
pseudo-elemento com z-index negativo é pintado **atrás do fundo da seção**, e não
atrás só do botão. Em qualquer bloco com `background` próprio — `.manifesto`
("Conhecer o escritório"), `.cta` e o `.btn-gold` — o dourado ficava escondido e,
como o hover troca a cor do texto para `--navy-900`, sobrava navy sobre navy.

Nos botões que estão em seção sem fundo (o "Ver os 6 projetos", por exemplo) o
efeito funcionava porque ali o dourado caía sobre o fundo do `body`.

Agora o `::before` está em `z-index:0` e o `span`/`i` em `z-index:1` — o mesmo
resultado visual, igual em todo lugar.
---

## Hero PLATINUM

Arquivos: `css/hero.css` e `js/hero.js`. As cenas ficam no topo de `js/hero.js` (`SCENES`).
A palavra PLATINUM já vem dentro dos próprios arquivos, então não há mais texto sobreposto nem recortes.

| cena | arquivo | duração |
|---|---|---|
| 1 | `img/hero/cena-1.mp4` (+ `cena-1.webp`, 1º quadro) | 8 s |
| 2 | `img/hero/cena-2.webp` (imagem, por enquanto) | 8 s |
| 3 | `img/hero.mp4` — interno, sem texto | 10 s |

Cada cena **sempre começa do começo** quando chega a vez dela: o vídeo da próxima cena fica
carregado e parado no 1º quadro até a troca. O cruzamento (`FADE`, 1,6 s) começa antes do fim,
para o vídeo terminar exatamente quando sai de cena. `dur` = duração do vídeo.

**Cena 2 virando vídeo** — troque `image:'img/hero/cena-2.webp'` por
`video:'img/hero/cena-2.mp4', poster:'img/hero/cena-2.webp'` e ajuste `dur`.

**Celular** — preencha `tall` em cada cena com os arquivos 9:16. Enquanto for `null`, o celular usa
o arquivo do desktop (e a palavra fica cortada nas laterais, porque o vídeo é 16:9).

**Vídeo 1** — reexportado sem a trilha de áudio (o hero é mudo) e com `faststart`, para começar a
tocar antes de baixar inteiro: 10,4 MB → 5,6 MB, visualmente igual (SSIM 0,988).

---

## Obra — prédio em 44 pavimentos + planta em linhas

Arquivos: `js/obra.js`, `js/planta.js`, `css/obra.css` e a pasta `img/obra/`.

| arquivo | o que é |
|---|---|
| `img/obra/torre-traco.webp` | a elevação enviada, ampliada 4x, sem mudar nenhuma linha (só o traço fica claro para o fundo escuro) |
| `img/obra/torre-luz.webp` | camada dourada das janelas acendendo, recortada dos vãos do próprio desenho |
| `img/obra/planta-real.png` | a planta original, idêntica à enviada — é o que o botão "Imagem real" mostra |

A animação só revela o desenho original de baixo para cima; nada no prédio é redesenhado.
Não há "sombra" do projeto ao fundo: o prédio aparece só conforme é construído.
Os 44 pavimentos dividem igualmente a altura entre o topo do embasamento e a laje do coroamento.

Ajustes no topo de `js/obra.js`: `DUR` (duração), `FLOORS` (44) e `FLOOR` (andar em que a câmera entra, hoje 32).
As linhas de nível que ficavam à direita da elevação foram retiradas do `torre-traco.webp`; o prédio em si não mudou.
Os tempos das etapas estão em `PH`, e os da planta em `PLAN_T`.

A planta em linhas (`js/planta.js`) usa o mesmo sistema de coordenadas da imagem real (550 x 807 px).
Ela aparece girada 90° no sentido horário para ocupar mais largura (`ROT = 90` no topo do arquivo;
`-90` gira para o outro lado e `0` deixa igual à foto). Os nomes dos ambientes continuam na horizontal.
A imagem real não gira.

**Zoom** — botões − / + (até 500%), clique no percentual para voltar a 100%, duplo clique para ampliar
no ponto, arrastar para mover e pinça no celular. O zoom volta a 100% ao trocar entre traço e imagem real.

**Cursor** — o cursor personalizado (bolinha) foi removido do site inteiro; vale o cursor padrão do sistema. Para o traço ficar preto no branco em vez de claro,
troque as cores em `.pl-walls`, `.pl-fix` etc. no fim do `css/obra.css`.

---

## Manifesto da home — 3 imagens + texto

Arquivos: bloco `.manifesto` no `index.html`, seção "manifesto" no `css/style.css`,
e a pasta `img/manifesto/`.

**Trocar as fotos** — substitua os arquivos mantendo o nome (ou mude o `src` no HTML):

| arquivo | posição | proporção do quadro | sugestão de exportação |
|---|---|---|---|
| `img/manifesto/lazer-1.webp` | atrás, à esquerda | 31:22 (≈ 1,41, horizontal) | 1240 × 880 |
| `img/manifesto/lazer-2.webp` | atrás, à direita | 32:35 (≈ 0,91) | 1280 × 1400 |
| `img/manifesto/predio.webp` | na frente, o maior | 38:42 (≈ 0,90, vertical) | 1520 × 1680 |

Com a foto já nessa proporção ela aparece inteira, sem corte. Se vier em outra proporção,
o quadro corta as sobras; ajuste o enquadramento com `style="--pos:center 25%"` no `<figure>`
(0% = mostra o topo, 100% = mostra a base). Para mudar o formato de um quadro, mude o `--ar`
de `.m-img-1/2/3` no CSS.

**Desenho ao fundo** — `img/manifesto/planta-linhas.svg`, no canto superior direito: os dois
pavimentos da planta enviada, redesenhados em linhas, sem nomes de ambientes nem metragens.
Intensidade: `--m-shape-op` em `.manifesto` (hoje `.11`).

---

## Estúdio — abertura e chamada com imagem fixa

Markup no `index.html` (`data-page="estudio"`), estilo no bloco "ESTÚDIO" do `css/style.css`
e `estudioHero()` no `js/site.js`.

Ordem da página: abertura em tela cheia (`.st-hero`) → texto (`.st-intro`) → números →
"O que guia cada torre" (`.st-list`) → faixa das cidades → chamada final (`.st-cta`).

**Imagem fixa** — `.st-hero` e `.st-cta` usam a classe `.st-par`: a foto fica parada e a página
desliza por cima dela. É feito com um `<img>` em `position:fixed` recortado pelo `clip-path` da
seção (e não com `background-attachment:fixed`), por isso funciona igual no iPhone.

| seção | arquivo | enquadramento |
|---|---|---|
| abertura | `img/estudio/entrada.webp` | `style="--pos:center 45%"` no `<img>` |
| chamada final | `img/legacy/capa.webp` | `style="--pos:center 40%"` no `<img>` |

Para trocar, mude o `src` do `<img class="st-par-img">`. Use fotos horizontais com pelo menos
1920 px de largura (a imagem cobre a tela inteira).

**Abertura** — conforme a página sobe, a foto escurece e o título some aos poucos (`--k`, de 0 a 1).
Com movimento reduzido ativo isso não acontece.
