# PREMIUM — site

## ⚑ Estrutura das pastas (a partir de 24/10/2026)

- **`site/`** — o site em si. **É só esta pasta que vai para a Cloudflare.** Os caminhos citados neste documento
  (`js/site.js`, `css/style.css`, `img/...`) ficam dentro dela.
- **`ferramentas/`** — `testar-local.py` (abre o site no computador).
- **`site/_worker.js`** — a Function da Cloudflare (ver atualização 9). Vai junto ao arrastar a pasta `site/`.
- **`LEIA-ME.md`** — este arquivo. Fica fora de `site/` para não ser publicado.

## Atualização — 24/10/2026 (9): Function da Cloudflare (um HTML só) — substitui o gerador

O site voltou a ter **um único `index.html`**. Quem monta o título, a descrição, a prévia de WhatsApp/Instagram e os
dados para o Google de cada página é a **Function** `site/_worker.js`, que roda no servidor da Cloudflare a cada visita,
lendo o `js/config.js` e o `js/data.js`. Não existe mais nada para "gerar": **mudou o config ou um projeto, é só publicar**.
(O `ferramentas/gerar-seo.mjs`, as cópias `estudio.html`/`projetos.html`/`projeto/*.html`, o `sitemap.xml`, o
`robots.txt` e o `_headers` foram removidos; a Function faz tudo isso agora.)

- **Publicar:** continua igual — arraste a pasta `site/` (Criar nova implantação). A Cloudflare reconhece o `_worker.js`
  sozinha; não há nada para configurar no painel. (A pasta `functions/` da Cloudflare não funciona arrastando a pasta;
  o `_worker.js` funciona, por isso foi o formato escolhido.)
- **O que a Function faz:** endereços limpos; 404 de verdade para endereço ou arquivo que não existe; `/sitemap.xml` e
  `/robots.txt` montados a partir dos projetos; redireciona `/projetos/` → `/projetos` e `/index.html` → `/`;
  cabeçalhos de segurança; cache de fotos (7 dias) e fontes (1 ano).
- **Endereço oficial:** `url` no `config.js` — hoje `https://platinum-7w1.pages.dev`. Só ele entra no Google: as prévias
  da Cloudflare (`xxxx.platinum-7w1.pages.dev`) saem com "não indexar". **Ao ligar o domínio próprio, troque o `url` e publique.**
- **Plano gratuito:** a Function conta como "requisição de Worker" só nas páginas (fotos e arquivos não contam);
  o limite gratuito da Cloudflare é bem maior do que este site usa.
- **Textos no `config.js`:** escreva títulos e descrições sem aspas duplas dentro do texto (a Function lê esse arquivo).
- **Testar no computador igual à Cloudflare:** com o Node.js instalado, na pasta acima de `site/`: `npx wrangler pages dev site`
  e acesse o endereço que aparecer. O `python ferramentas/testar-local.py` continua servindo para ver visual e navegação.

**Nas atualizações 7 e 8 abaixo, desconsidere** os trechos sobre rodar `node ferramentas/gerar-seo.mjs`, as páginas
estáticas e o arquivo `_headers`. O resto (Search Console, Analytics, cookies, Política de Privacidade) continua valendo.

## Atualização — 24/10/2026 (8): Cloudflare Web Analytics e Política de Privacidade completa

### Medir as visitas sem pagar nada e sem aviso de cookies (recomendado)
- **Cloudflare Web Analytics** (gratuito, sem cookies): no projeto da Cloudflare Pages → **Métricas** → **Web Analytics** →
  ativar. Mostra visitas por página, origem (Google, Instagram…), país e aparelho. Não precisa mexer no código.
  Se a Cloudflare pedir para colar um script (site fora da Pages), copie só o **token** dele para `cloudflareAnalytics`
  no `site/js/config.js`.
- **Google Search Console** (gratuito): mostra por quais pesquisas as pessoas chegam ao site. Ver item 3 abaixo.
- Com `ga4` e `metaPixel` vazios, o site **não usa cookies** e o aviso não aparece. O Google Analytics continua
  disponível (também é gratuito), se um dia quiser relatórios mais detalhados — aí o aviso de cookies liga sozinho.
- O painel "Visão geral" do domínio na Cloudflare conta *solicitações* (cada foto, fonte e script, e também robôs),
  por isso os números são bem maiores que o de visitas reais.

### Política de Privacidade e de Cookies (`/privacidade`)
- Nova estrutura, inspirada na política de referência enviada: índice, glossário, dados tratados, finalidades e bases
  legais, cookies (tipos, duração e como controlar no navegador), compartilhamento, segurança e descarte (LGPD e Marco
  Civil), lista completa de direitos, canal do encarregado (art. 41), atualizações e lei aplicável/foro.
- **Se ajusta sozinha ao `config.js`:** sem GA4/Pixel, diz que o site não usa cookies de análise nem de publicidade;
  ligando cada um, os trechos e as linhas da tabela correspondentes aparecem.
- Campos novos no `config.js`: `emailPrivacidade` (e-mail do encarregado; vazio = usa o `email`), `encarregado`
  (nome, opcional) e `foro`.
- Trechos da política de referência que **não** foram usados, de propósito: formulários, newsletter e downloads (o site
  não tem), "aceite obrigatório" e "sem concordar sua experiência será restrita" (a LGPD exige que recusar seja possível).
- Continua valendo: **peça para um advogado revisar antes de publicar.**

### Atualizar o site que já está no ar
No mesmo projeto da Cloudflare Pages → **Criar nova implantação** → arraste a **pasta `site/`** (não o zip inteiro).
O endereço continua o mesmo; links antigos com `/#/` são convertidos sozinhos.

## Atualização — 24/10/2026 (7): Cloudflare, SEO, cookies (LGPD) e Google Analytics

### 1. Antes de publicar: preencher o `site/js/config.js`
Tudo o que é da empresa e os códigos de medição ficam num lugar só:
- `url` — o domínio oficial, ex. `https://www.rsplatinum.com.br` (escolha **com ou sem www** e use sempre o mesmo).
- `ga4` — código do Google Analytics (`G-XXXXXXXXXX`). Vazio = sem Analytics e sem aviso de cookies.
- `metaPixel` — Pixel da Meta, se for anunciar no Instagram/Facebook. Pode ficar vazio.
- `telefone`, `email`, `razaoSocial`, `cnpj` — aparecem no Google e na Política de Privacidade.
- `SEO_PAGINAS` — título e descrição de cada página no Google (os projetos usam o `intro` do `data.js`).

Depois, na pasta acima de `site/`, rode **`node ferramentas/gerar-seo.mjs`** (precisa do Node.js, nodejs.org).
Ele atualiza as páginas estáticas, o `sitemap.xml` e o `robots.txt`. **Rode de novo sempre que mudar o `config.js`
ou incluir/alterar um projeto no `data.js`** (se preferir, me mande que eu gero).

### 2. Publicar na Cloudflare Pages
1. dash.cloudflare.com → **Workers e Pages** → **Criar** → aba **Pages** → **Enviar ativos** (upload direto).
2. Dê um nome ao projeto e **arraste a pasta `site/`**. Publicar.
3. No projeto → **Domínios personalizados** → adicione o domínio (se o DNS já estiver na Cloudflare, ela configura sozinha).
4. Para atualizar o site depois: no projeto → **Criar nova implantação** → arraste a pasta `site/` de novo.

O que já está pronto para a Cloudflare:
- **Endereços limpos:** `/projetos` é entregue pelo `projetos.html`, `/projeto/legacy` pelo `projeto/legacy.html`.
  Qualquer outro endereço cai no site, que mostra a página **"não encontrada"** (marcada para o Google não indexar).
  **Não crie um arquivo `404.html` na raiz** — ele desliga esse comportamento.
- **`_headers`:** cabeçalhos de segurança e cache (fotos 7 dias, fontes 1 ano).
- Em **Regras → Regras de redirecionamento**, crie um redirecionamento do domínio sem www para o com www (ou o contrário),
  igual ao que está no `url` do `config.js`.

### 3. Google Search Console (aparecer no Google)
1. search.google.com/search-console → **Adicionar propriedade** → **Domínio** → digite o domínio.
2. O Google mostra um registro TXT: com o DNS na Cloudflare, ele oferece **verificar automaticamente pela Cloudflare**.
   (Alternativa: método "tag HTML" → cole o código em `googleVerificacao`, no `config.js`, e gere de novo.)
3. Depois de verificado: **Sitemaps** → envie `sitemap.xml`.
4. Opcional: **Inspeção de URL** → cole o endereço da home → **Solicitar indexação** (acelera a primeira aparição).

### 4. Google Analytics 4
1. analytics.google.com → criar conta/propriedade → **Fluxo de dados da Web** com o domínio.
2. Copie o **ID da métrica** (`G-...`) para `ga4` no `config.js`, gere e publique.
3. Em **Administrador → Eventos**, marque **`clique_whatsapp`** como **evento-chave** (é a conversão do site).
4. Eventos enviados: `page_view` (cada página), `clique_whatsapp`, `clique_telefone`, `clique_email`,
   `clique_instagram`, `clique_artista` (marcações do banner). Cada um leva `local` (de qual página veio o clique).
5. Recomendado: **Administrador → Retenção de dados** → 14 meses (é o que diz a Política de Privacidade).

### 5. Cookies e LGPD
- O aviso aparece na primeira visita (só se `ga4` ou `metaPixel` estiverem preenchidos): **Aceitar**, **Recusar** ou
  **Personalizar** (Análise e Marketing separados). A escolha vale 12 meses.
- Antes da resposta, o Google fica no **Modo de Consentimento v2** com tudo negado: não grava cookies, só sinais anônimos.
  O Pixel da Meta nem carrega sem o "sim" para Marketing.
- **Preferências de cookies**, no rodapé e na Política, reabre o aviso.
- **Política de Privacidade** em `/privacidade`: modelo escrito para este site (sem formulário, contato por WhatsApp,
  Analytics, Pixel e Cloudflare), com razão social, CNPJ e e-mail puxados do `config.js`.
  **Peça para um advogado revisar antes de publicar.** Se o site ganhar formulário, newsletter ou outra ferramenta, a política precisa ser atualizada.

### 6. O que foi feito para o Google (SEO)
- Título, descrição e endereço canônico próprios em cada página e projeto, atualizados também ao navegar.
- Prévia de link (WhatsApp, Instagram, LinkedIn, Facebook): título, descrição e imagem 1200 × 630 por página,
  em `img/og/` (uma por projeto + `padrao.jpg`). **Projeto novo:** gere a imagem dele com o nome `img/og/<slug>.jpg`
  (1200 × 630, JPG); sem ela, a prévia usa a capa.
- Dados estruturados (schema.org): a empresa (serviço profissional, área atendida, Instagram), o site,
  a trilha de navegação e cada projeto como obra, com fotos e cidade.
- `sitemap.xml` com todas as páginas e as fotos dos projetos (ajuda no Google Imagens) e `robots.txt`.

### 7. Testar no computador
Na pasta acima de `site/`: **`python ferramentas/testar-local.py`** e acesse `http://localhost:8000`
(porta ocupada? `python ferramentas/testar-local.py 8080`). Funciona igual à Cloudflare.

## Atualização — 23/10/2026 (6): endereços limpos (sem o /#/)

Os endereços são `/estudio`, `/projetos`, `/contato` e `/projeto/legacy`. Links antigos com `/#/` continuam funcionando
(o site troca sozinho para o formato novo). Publicação e teste local: ver a atualização (7), logo acima.

## Atualização — 23/10/2026 (5): marcações dos artistas no banner

No banner "Arquitetura e música nos inspiram", cada artista ganhou uma marcação no estilo do Instagram (nome, dupla e @).
- **Computador:** passar o mouse em cima de uma pessoa mostra a marcação dela; o botão **Quem é quem** (canto de cima)
  mostra todas, em duas alturas alternadas. Clicar numa marcação abre o Instagram do artista.
- **Celular:** tocar no banner mostra/esconde todas, só com o nome curto.
- **Lista:** `ARTISTAS`, no fim do `js/data.js` — nome, nome curto, dupla, Instagram e a posição do rosto (`x`, `y` em %).
  A 3ª pessoa da esquerda está comentada, sem nome: é só preencher a linha. Se trocar o banner, ajuste `x`/`y`.
- **Estilo:** bloco "marcações dos artistas" no `css/style.css` (antes de `.pat-banner img`).

## Atualização — 23/10/2026 (4): 46 novos clientes (58 no total)

A seção “Patrocinadores” passou a se chamar **Clientes** (título, lista `CLIENTES` no `js/data.js`, pasta `img/clientes/`).


- **Ícones novos** em `img/clientes/` (SVG de uma cor só, vetorizados das logos enviadas). Os 46 novos somam
  ~120 KB, ou ~45 KB com a compressão do servidor. A faixa só é montada quando a seção chega perto da tela; antes disso
  nenhum ícone é baixado.
- **Formato** — igual aos atuais: símbolo + nome escrito ao lado, em cinza; no hover o ícone ganha a cor da marca
  (`cor` na lista; marcas muito escuras foram clareadas para aparecer no fundo chumbo). No celular já aparecem coloridos.
- **Logos que já são o nome** (ARS Kammer, Dallo, BSX, Justus, AS Ramos, IM7, Nostracon, ProHouse e C'Seger) entram
  inteiras, sem o nome ao lado (`wm: true`). O tamanho é calculado pela proporção, para pesarem igual aos ícones;
  `esc` faz o ajuste fino de uma logo específica.
- **Faixas** — agora cada linha leva metade da lista (antes as duas repetiam todos). A velocidade acompanha o número de
  clientes: `PAT_SEG` (segundos por cliente) em `clientes()` no `js/site.js`.
- **Ordem** — a da planilha enviada (Santana, Grupo N1, Pasqualotto…); está em `CLIENTES`, no fim do `js/data.js`.

## Atualização — 23/10/2026 (3): chamada da home em fundo claro

A chamada "Tem um terreno e uma ideia?" voltou para o fundo claro (Névoa). O final da home agora alterna
claro → escuro (clientes + banner) → claro (chamada) → escuro (rodapé), em vez de três blocos escuros seguidos.
Estilo: `.cta` no `css/style.css`. Para deixá-la escura de novo, volte `.cta:not(.cta-page)` para a regra TEMA ESCURO.

## Atualização — 23/10/2026 (2): mosaico sem corte e sem buraco, banner integrado

- **Mosaico sem corte** — as fotos da galeria agora aparecem inteiras. Saiu o efeito de a foto deslizar dentro do
  quadro (ele precisava ampliar a imagem e cortava o topo e a base). O parallax das colunas continua.
- **Mosaico sem buraco no fim** — as fotos são distribuídas para as colunas ficarem com alturas parecidas, e a largura
  de cada coluna é ajustada alguns px para todas terminarem exatamente na mesma linha. O parallax começa com as colunas
  desencontradas no topo e as alinha quando o fim da galeria chega no pé da tela. Ajustes: `GM_AMP` e `GM_SPEED` no
  `js/site.js` (`GM_SPEED` = quanto cada coluna começa abaixo, de 0 a 1). Sempre pelo menos 2 fotos por coluna.
- **Clientes + banner** — a seção virou um bloco escuro (cinza chumbo, como na RS Concept em azul) que emenda com a
  chamada "Tem um terreno..." logo abaixo. As bordas do banner se dissolvem no fundo (`--pb-fade` em `.pat-banner img`),
  então ele faz parte da página em vez de parecer um anúncio colado. As faixas de logos seguem iguais, agora no escuro.

## Atualização — 23/10/2026: galeria em mosaico, dropdown de Projetos, fundo Névoa

- **Galeria em mosaico com parallax** (página do projeto) — o carrossel virou um mosaico em colunas: 4 em tela grande
  (quando o projeto tem 10 fotos ou mais), 3 no computador e 2 no tablet/celular. Cada foto aparece inteira, na proporção
  original, e entra sempre na coluna mais curta. Ao rolar, as colunas andam em velocidades diferentes e cada foto desliza
  um pouco dentro do quadro. Clique abre a tela cheia já na foto clicada (setas e swipe continuam lá).
  Ajustes no topo do bloco `GALERIA EM MOSAICO` do `js/site.js`: `GM_AMP` (quanto as colunas se deslocam), `GM_SPEED`
  (velocidade de cada coluna) e `GM_INNER` (quanto a foto desliza no quadro). Espaço entre fotos: `--gm-gap` em `.gm` no CSS.
  Com movimento reduzido ativo, o mosaico fica parado. A lista de fotos continua sendo `capa + gallery` no `js/data.js`.
- **Dropdown "Projetos"** — no computador, passar o mouse em Projetos abre a lista de todos os empreendimentos com a capa
  do projeto sob o mouse à direita, e "Ver todos os projetos" no fim. É montado sozinho a partir de `PROJECTS` no
  `js/data.js`: projeto novo entra no dropdown automaticamente. Funciona também pelo teclado (Tab abre, Esc fecha).
  No celular nada muda (menu do botão). Estilo: bloco `.dd` no `css/style.css`; JS: `montaDropdown()` no `js/site.js`.
- **Fundo** — o site todo agora usa a Névoa (#E8E8E8, o tom do manifesto) como fundo claro, no lugar do branco
  (`--bg` no `:root`). O header ao rolar usa `--bg-hd` (#F4F4F4 translúcido, um passo mais claro que o fundo) e o dropdown
  `--bg-dd` (#F4F4F4). `--bg-2` (#DCDCDC) é o quadro atrás das fotos enquanto carregam. O quadro da planta continua branco.

## Atualização — 15/10/2026 (2): faixa de clientes

Nova seção na home, entre **Projetos em destaque** e **Tem um terreno e uma ideia?**: duas faixas em loop,
em sentidos opostos, com o ícone de cada patrocinador e o nome escrito ao lado (em Montserrat).

- **Lista** — `CLIENTES` no fim do `js/data.js` (`nome`, `logo`, e `mono`/`ar` nos ícones de uma cor só).
  Para incluir ou tirar um patrocinador, mexa só ali.
- **Ícones** — `img/clientes/*.svg`: só o símbolo, recortado das logos enviadas e vetorizado.
  Os de uma cor só (Poti, Mètre, Zanella, Andorinha) assumem a cor do texto, então funcionam no fundo claro.
- **Comportamento** — no computador os ícones ficam em cinza e ganham a cor original no hover, e a faixa
  pausa com o mouse em cima. No celular os ícones já aparecem coloridos.
  Velocidade: `58` e `66` (segundos por volta) em `clientes()` no `js/site.js`.
- **Estilo** — bloco `.pat` no `css/style.css`.
- **Banner dos artistas** — logo abaixo das faixas, `img/artistas-platinum.webp` (2048 × 684, convertido do PNG, 124 KB).
  Para trocar, substitua o arquivo mantendo a mesma proporção (ou ajuste `width`/`height` no `<img>` do `index.html`).

## Atualização — 15/10/2026: identidade RS Platinum (logo, fontes, cores)

Só mudaram logo, tipografia e cores, conforme o **Manual de Identidade Visual RS Platinum**. Estrutura, textos,
animações, rotas e JS continuam iguais.

**Logo** — vetores dos arquivos-mestre (`RS_PLATINUM_LOGO_VETOR.svg` e `RS_PLATINUM_MARCA_BLACK.svg`), em curvas,
nos símbolos do topo do `index.html` (mesmos ids de antes, para nada quebrar):
`#lk-mark`, `#logo`, `#logo-tight` = monograma "RS" (cubo) · `#wordmark`, `#wm-platinum` = RAFAEL SCHMITT + bloco PLATINUM.
A cor vem de `currentColor` (preto no claro, branco no escuro). Header e rodapé usam o lockup horizontal do manual:
`--lk-h` = altura do cubo (54px desktop, 46px celular, 62px rodapé); a assinatura tem .46 dessa altura.
O preloader mostra a versão vertical (cubo + assinatura). A rotação de 180° no hover e na cortina continua.
Regerados a partir do vetor: `img/marca.webp`, `img/marca.png`, `img/marca-clara.png`, `img/marca.svg`,
`img/favicon.svg`, `img/favicon-64.png`, `img/apple-touch-icon.png`.

**Fontes** — `--f-title` e `--f-sub` = Montserrat (títulos em Bold 700 via `--w-title`; rótulos e menus em Montserrat),
`--f-body` = Artifakt Element (corpo de texto e as cotas da planta animada). Nexa Heavy só existe dentro do logo (em curvas).
Montserrat está em `fonts/Montserrat-Variable.woff2` (OFL). Artifakt Element é da Autodesk: o CSS usa a fonte instalada no
computador, depois `fonts/ArtifaktElement-Regular.woff2` / `-Bold.woff2` (se você colocar esses arquivos lá) e por último o CDN
oficial da Autodesk. Para o site não depender de servidor externo, baixe os dois .woff2 e ponha em `/fonts`.
Tenor Sans, DM Sans e Inter foram removidas.

**Cores** — bloco `:root` do `css/style.css`:

| variável | cor | uso |
|---|---|---|
| `--preto` | #000000 | texto principal no claro |
| `--branco` | #FFFFFF | fundo principal, texto no escuro (antes `--creme`) |
| `--nevoa` | #E8E8E8 | painéis, manifesto, galeria (antes `--linho`) |
| `--platina` | #8A8D8F | destaque: botões, linhas, faixas (antes `--areia`) |
| `--aco` | #A8A8A8 | traços e texto secundário no escuro (antes `--taupe`) |
| `--chumbo` | #1E2022 | blocos escuros: hero, obra, chamada, menu, rodapé (antes `--grafite`) |

#E8E8E8 e #A8A8A8 são do gradiente metálico de referência do manual (`--metal`). Todos os `rgba()` antigos foram
convertidos para as cores novas, inclusive em `js/obra.js` e nos SVGs do manifesto; `img/obra/torre-luz.webp` foi recolorida
de areia para aço.

---

## Atualização — 06/10/2026

- **Vídeo do hero** — trocado pelo novo (entrada no apartamento). Mesmo esquema de antes: mudo, em loop, 10 s, 24 fps.
  - `img/hero.mp4` — 1920 × 1080 (antes 1280 × 720), H.264, 5,5 MB (original 7,9 MB). Sem áudio (o vídeo já tocava mudo).
    Compressão CRF 22: SSIM 0,992 em relação ao original, diferença invisível.
  - `img/hero-mobile.mp4` — recorte vertical 9:16 do centro do vídeo, 608 × 1080 (resolução nativa, sem ampliar), 2,1 MB.
  - `img/hero-poster.webp` e `img/hero-poster-mobile.webp` — 1º quadro do vídeo novo.
- **Marca PLATINUM** — agora é o vetor do IDV (pág. 7, "Grid layouts"), copiado do PDF: o PLATINUM desenhado
  (A sem travessão) e "ARQUITETURA DE ALTO PADRÃO." em Outfit Thin, já em curvas. Símbolos `#lk-mark` e `#wordmark`
  no topo do `index.html`. A régua é a do PDF: a ponta da logo passa acima do nome, o topo do PLATINUM fica na linha
  horizontal da logo e a base do subtítulo na base da logo. Subtítulo na mesma cor do nome, como no PDF.
  Tamanho: `--lk-h` = altura do conjunto (48px no desktop, 42px no celular, 52px no rodapé).
  O preloader também usa o PLATINUM em vetor (`#wm-platinum`).

## Atualização — 02/10/2026 (2)

- **Galeria** — o título da galeria na página do projeto agora é "Galeria" (antes repetia o nome do projeto).
- **Foto da equipe** — `img/estudio/equipe.jpg` (6036 × 4024, 1,5 MB) virou `img/estudio/equipe.webp`
  (2400 × 1600, qualidade 82, 142 KB). O quadro passou para 3:2, a proporção da foto, então ela aparece inteira.
  O .jpg foi retirado da pasta do site.
- **Texto do hero** — aparece por 5 s e some, ficando só o vídeo. Para mudar o tempo: `TEXTO_SEG` em `js/hero.js`.
  Ao voltar para o Início (ou rolar de volta até o topo) o texto aparece de novo pelo mesmo tempo.

## Atualização — 02/10/2026

1. **Hero só com o vídeo** — `img/hero.mp4` (celular: `hero-mobile.mp4`) em loop, com o título e o texto à esquerda.
   As duas imagens continuam em `img/hero/` e no topo de `js/hero.js`, só desligadas: `HERO_SO_VIDEO = false` volta às 3 cenas.
2. **Logo + nome alinhados** — o lockup agora segue a marca oficial: a ponta da logo encosta no topo do PLATINUM,
   a base encosta na base de Arquitetura de Alto Padrão, e as duas linhas têm a mesma largura (símbolos `#logo-tight`
   e `#wordmark` no topo do `index.html`). Tamanho: `--lk-h` em `.lockup` (38px no desktop, 32px no celular, 36px no rodapé).
   O desalinhamento antigo vinha de um erro no `<use>` da logo, que desenhava a marca ~14px acima e à esquerda da própria caixa.
3. **Rotação** — no hover a logo gira 180° em torno do próprio centro (antes 90°, e "orbitando" por causa do mesmo erro).
4. **Transição entre páginas** — uma camada só, em grafite, com a logo clara (`img/marca-clara.png`) girando 180° ao entrar. Sem faixas.
5. **Foto da equipe** — nova seção no Estúdio, logo depois do texto. Coloque o arquivo em `img/estudio/equipe.webp`
   (horizontal, ~2400 × 1350). Enquanto ele não existir aparece um quadro neutro com a logo.
6. **Faixa das cidades** (Porto Belo · Santa Catarina · Itapema) removida do Estúdio.
7. **Celular** — o lockup tem 28px de folga da borda (respeita também o recorte do iPhone).
8. **Galeria sem borda** — o quadro assume a proporção de cada foto (`fit()` em `initGallery`, no `js/site.js`), então não sobra faixa clara.
9. **"Ver todos os projetos"** no lugar de "Ver os 6 projetos".
10. **Cursor** — bolinha + anel que segue o mouse, igual ao rs-concept. Sobre cards e fotos da galeria o anel cresce e mostra "VER".
    Só aparece em computador com mouse.

---

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

**Logo** — `img/marca.webp` é a logo original (só a margem transparente foi cortada; WebP sem perda), usada no
carregamento e na cortina. No header e no rodapé a marca é o vetor `#logo` no topo do `index.html`:
mesma geometria, traço fixo de 1px, porque a imagem ficaria quase invisível a 40px.
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
Os quatro números que ficavam embaixo da animação (Top 3, 26 anos...) foram removidos.

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
| `img/obra/planta-real.webp` | a planta original (WebP, visualmente idêntica à enviada) — é o que o botão "Imagem real" mostra |

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

Para o traço ficar preto no branco em vez de claro,
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
| abertura | `img/yangzhou/03.webp` | `style="--pos:center 55%"` no `<img>` |
| chamada final | `img/legacy/capa.webp` | `style="--pos:center 40%"` no `<img>` |

Para trocar, mude o `src` do `<img class="st-par-img">`. Use fotos horizontais com pelo menos
1920 px de largura (a imagem cobre a tela inteira).

**Abertura** — conforme a página sobe, a foto escurece e o título some aos poucos (`--k`, de 0 a 1).
Com movimento reduzido ativo isso não acontece.
