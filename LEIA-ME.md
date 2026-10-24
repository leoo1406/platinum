# Rafael Schmitt Platinum — site

Guia do site como ele está hoje: o que tem, como rodar, como publicar, onde editar cada coisa
e como ligar a medição de visitas e o Google. O histórico completo de mudanças ficou em
`ferramentas/historico-de-mudancas.md`.

---

## 1. Estrutura das pastas

```
Premium-RS/
├── site/                  ← o site. É SÓ ESTA PASTA que a Cloudflare publica (diretório de saída = site)
│   ├── index.html         todas as páginas (o site troca de página sem recarregar)
│   ├── _worker.js         Function da Cloudflare: SEO de cada página, 404, sitemap, robots
│   ├── css/               style.css (estilo geral) · hero.css · obra.css
│   ├── js/
│   │   ├── config.js      domínio, códigos de medição, dados da empresa, títulos para o Google
│   │   ├── data.js        projetos, destaques da home, clientes, artistas do banner
│   │   ├── cookies.js     aviso de cookies (LGPD) + Google Analytics / Pixel
│   │   ├── site.js        motor do site (rotas, animações, galeria, clientes, marcações…)
│   │   ├── hero.js        vídeo do topo da home
│   │   ├── obra.js        animação do prédio subindo
│   │   └── planta.js      planta em linhas da animação
│   ├── img/               fotos, vídeos, logos (clientes/, og/, um pasta por projeto…)
│   └── fonts/             Montserrat (e Artifakt Element, se você colocar)
├── ferramentas/
│   ├── testar-local.py    abre o site no computador (visual e navegação)
│   └── historico-de-mudancas.md
├── .gitignore             o que não vai para o GitHub (.wrangler, node_modules…)
└── LEIA-ME.md             este arquivo (fica fora de site/ para não ser publicado)
```

---

## 2. Rodar no computador

Abrir o `index.html` com duplo clique **não funciona**: o site precisa de um servidor.

### Jeito completo — igual à Cloudflare (recomendado)
Roda o site junto com a Function: títulos de cada página, 404, sitemap e prévia de compartilhamento.

1. Instale o **Node.js** (versão LTS, em nodejs.org) — só na primeira vez.
2. Abra um terminal **na pasta que contém a `site/`** (não dentro dela):
   - **Windows:** abra a pasta no Explorador, clique na barra de endereço, digite `cmd` e Enter.
   - **Mac:** botão direito na pasta → Serviços → Novo Terminal na Pasta.
   - **VS Code:** Terminal → Novo Terminal.
3. Rode:
   ```
   npx wrangler pages dev site
   ```
   Na primeira vez ele pede para instalar o Wrangler: digite `y` e Enter.
4. Abra o endereço que aparecer (normalmente `http://localhost:8788`). Para parar: `Ctrl + C`.

- Mudou CSS, HTML, fotos ou JS? Atualize a página no navegador.
- Mudou o **`config.js`** ou o **`data.js`**? Pare (`Ctrl + C`) e rode de novo — a Function guarda os dois na memória.
- O aviso `Unable to fetch the Request.cf object` pode ser ignorado.
- A pasta **`.wrangler`** que aparece é temporária do teste: pode apagar quando quiser. Só não deixe que ela
  apareça **dentro** de `site/` (acontece se rodar o comando de dentro dela). O `.gitignore` já a deixa fora do GitHub.

### Jeito rápido — só visual e navegação
Com Python instalado, na mesma pasta:
```
python ferramentas/testar-local.py        (Windows: py ferramentas/testar-local.py)
```
e abra `http://localhost:8000` (porta ocupada? `python ferramentas/testar-local.py 8080`).
Não roda a Function: títulos por página, 404 e sitemap não funcionam nele.

---

## 3. Publicar (GitHub → Cloudflare Pages)

**Endereço atual (temporário):** https://platinum-7w1.pages.dev/

O projeto está ligado ao GitHub: **cada push na branch principal publica o site sozinho**. Pushes em outras branches
geram um endereço de prévia (`<branch>.platinum-7w1.pages.dev`), marcado como "não indexar" para o Google.

### Configuração de build na Cloudflare (uma vez só — obrigatório)
Como o site fica dentro da pasta `site/`, a Cloudflare precisa saber disso:
dash.cloudflare.com → **Workers e Pages** → projeto **platinum** → **Configurações** → **Compilações**
(Builds) → **Configuração de compilação** → **Editar**:

| campo | valor |
|---|---|
| Predefinição de framework | **Nenhuma** |
| Comando de compilação | *(vazio)* |
| Diretório de saída de compilação | **`site`** |
| Diretório raiz (avançado) | *(vazio — raiz do repositório)* |

Salve **antes** de dar o push com a estrutura nova. Sem isso, a Cloudflare procura o `index.html` na raiz do
repositório e o site sai do ar. Com isso, só a pasta `site/` é publicada (o `LEIA-ME.md` e as `ferramentas/` ficam
só no GitHub).

### No dia a dia
1. Edite os arquivos, teste no computador (item 2) se quiser.
2. `git add`, `git commit`, `git push`.
3. Em 1 a 2 minutos a nova versão está no ar (acompanhe em **Implantações**, no projeto da Cloudflare).
   Se algo der errado, em **Implantações** dá para voltar para uma versão anterior com um clique (**Reverter**).

- Não há nada para configurar além do diretório de saída: a Cloudflare reconhece o `_worker.js` sozinha.
- **Não crie `404.html`** na raiz de `site/` (a Function já cuida das páginas que não existem).
- O `.gitignore` já deixa de fora a pasta `.wrangler` do teste local e arquivos do sistema.

### O que a Function (`_worker.js`) faz sozinha
- Endereços limpos: `/estudio`, `/projetos`, `/contato`, `/privacidade`, `/projeto/legacy`…
- Coloca no HTML de cada página o título, a descrição, a imagem de compartilhamento (WhatsApp, Instagram,
  Facebook, LinkedIn) e os dados estruturados para o Google, lendo o `config.js` e o `data.js`.
- Responde **404 de verdade** para página ou arquivo que não existe (e o site mostra "Página não encontrada").
- Monta o **`/sitemap.xml`** (com todas as fotos dos projetos) e o **`/robots.txt`**.
- Redireciona `/projetos/` → `/projetos` e `/index.html` → `/`.
- Cabeçalhos de segurança; cache de fotos (7 dias) e fontes (1 ano).
- Links antigos com `/#/` (ex.: `/#/projetos`) são convertidos sozinhos para o formato novo.

**Custo:** zero. A Function só roda ao abrir uma página (fotos e arquivos não contam), muito abaixo do limite gratuito.

---

## 4. O que tem no site

### Páginas
| endereço | página |
|---|---|
| `/` | Início |
| `/estudio` | Estúdio |
| `/projetos` | Todos os projetos, com busca e filtro por tipo |
| `/projeto/<slug>` | Página de cada projeto |
| `/contato` | Contato |
| `/privacidade` | Política de Privacidade e de Cookies |
| qualquer outro | Página não encontrada (404) |

### Início (de cima para baixo)
- **Vídeo de abertura** em loop, mudo, com o texto aparecendo por alguns segundos.
- **Manifesto** — 3 imagens sobrepostas + "Há 26 anos transformando criatividade em inovação", com a planta em linhas ao fundo.
- **Diferenciais** — painéis lado a lado que abrem no hover/clique (no celular viram pilha).
- **Projetos em destaque** — mosaico com 6 projetos.
- **Obra** — animação do prédio subindo em 44 pavimentos + planta em linhas com zoom ("Imagem real" mostra a planta original).
- **Clientes** — duas faixas de logos em loop, em sentidos opostos (58 clientes), em bloco escuro.
- **Banner dos artistas** — "Arquitetura e música nos inspiram", com marcações no estilo do Instagram.
- **Chamada** — "Tem um terreno e uma ideia?", em fundo claro, com WhatsApp, telefone e Instagram.
- **Rodapé** escuro, com links para Política de Privacidade e (se houver cookies) Preferências de cookies.

### Página do projeto
- Topo com foto grande, ficha (categoria, endereço, área, unidades) e texto de introdução.
- Vídeo (se o projeto tiver) ou imagem na seção "O projeto".
- **Galeria em mosaico com parallax** — fotos inteiras, sem corte, base sempre reta; 4/3/2 colunas conforme a tela.
  Clique abre em tela cheia, com setas e swipe.
- **Plantas** — abas com cada tipologia, zoom (botões, duplo clique, arrastar, pinça, Ctrl + rodinha) e tela cheia.
- "Outros projetos" no fim.

### Em todo o site
- **Dropdown "Projetos"** no menu (computador): lista todos os projetos com a capa de quem está sob o mouse.
- **Transição entre páginas** com cortina e logo girando.
- **Cursor personalizado** (bolinha + anel; mostra "VER" sobre fotos e cards) — só em computador.
- **Botão flutuante do WhatsApp.**
- **Movimento reduzido:** se o aparelho pedir, as animações ficam paradas.

### Identidade visual
- Cores (bloco `:root` do `css/style.css`): `--preto` #000, `--branco` #FFF, `--nevoa` #E8E8E8 (fundo claro do site),
  `--platina` #8A8D8F, `--aco` #A8A8A8, `--chumbo` #1E2022 (blocos escuros).
- Fontes: **Montserrat** (títulos, menus, rótulos) e **Artifakt Element** (texto). A Artifakt é da Autodesk: para o site
  não depender de servidor externo, coloque `ArtifaktElement-Regular.woff2` e `ArtifaktElement-Bold.woff2` em `site/fonts/`.
- Logo RS Platinum em vetor no topo do `index.html` (`#lk-mark`, `#wordmark`, `#wm-platinum`).

---

## 5. Onde editar cada coisa

| o quê | onde |
|---|---|
| Projetos (nome, cidade, área, fotos, plantas, vídeo, texto) | `PROJECTS` no `js/data.js` |
| Projetos do destaque da home | `HOME_FEATURED` no `js/data.js` (6 slugs, dois grupos de três) |
| Clientes (logos das faixas) | `CLIENTES` no `js/data.js` + SVG em `img/clientes/` |
| Artistas do banner (nome, @, posição do rosto) | `ARTISTAS` no `js/data.js` |
| Domínio, códigos de medição, e-mail, CNPJ | `SITE` no `js/config.js` |
| Título e descrição de cada página no Google | `SEO_PAGINAS` no `js/config.js` (projetos usam o `intro` do `data.js`) |
| Telefone, WhatsApp, Instagram visíveis no site | `index.html` (chamada da home, página Contato, menu, rodapé, botão flutuante) |
| Diferenciais | `#svcList` no `index.html` |
| Cores | `:root` no `css/style.css` |

### Campos de cada projeto (`js/data.js`)
| campo | para que serve |
|---|---|
| `slug` | parte do endereço (`/projeto/legacy`) e nome da pasta em `img/` |
| `title`, `cat`, `cidade`, `endereco`, `area`, `unidades` | ficha do projeto |
| `intro` | texto de introdução **e descrição no Google** |
| `texto` | parágrafos extras (lista vazia = não aparece) |
| `cover` | capa dos cards (4:3, 2000 × 1500) |
| `coverPosition` | enquadramento da capa (`'center 40%'`…) |
| `heroImage` / `heroPosition` | foto do topo da página (vazio = usa a capa) |
| `mediaImage` | imagem da seção "O projeto" (vazio = 1ª da galeria) |
| `gallery` | fotos da galeria, em ordem (a capa entra sozinha como 1ª — não repita) |
| `video` / `videoPoster` | vídeo da seção "O projeto" (`null` = sem vídeo) |
| `plantas` | `{ nome, info, img }` de cada planta (lista vazia = a seção não aparece) |

**Projeto novo:** crie a pasta `img/<slug>/`, acrescente o bloco no `PROJECTS` e, para a prévia de WhatsApp,
uma imagem `img/og/<slug>.jpg` em 1200 × 630 (sem ela, a prévia usa a capa). Ele entra sozinho na página Projetos,
no dropdown, no sitemap e no Google. **Escreva os textos sem aspas duplas dentro** (a Function lê esse arquivo).

### Clientes (`CLIENTES`)
- `nome`, `logo` — e, nos ícones de uma cor só, `mono: true` e `ar` (proporção largura/altura do SVG).
- `cor` — cor da marca no hover (sem cor = fica claro). No celular os ícones já aparecem coloridos.
- `wm: true` — a logo já é o nome escrito: entra inteira, sem o nome ao lado. `esc` ajusta o tamanho (0.8 menor, 1.3 maior).
- A ordem é a da lista; cada faixa leva metade. A faixa só carrega quando a seção chega perto da tela.

### Artistas do banner (`ARTISTAS`)
- `nome`, `curto` (usado no celular), `grupo` (dupla), `ig` (Instagram; sem link = marcação sem @), `x`/`y` (centro do rosto, em %).
- Computador: passar o mouse mostra a marcação; o botão **Quem é quem** mostra todas. Celular: tocar no banner mostra/esconde.
- Se trocar o banner, ajuste `x`/`y` de cada um.

---

## 6. Imagens e vídeos

- **Formato:** fotos sempre em **webp**; vídeos em **mp4 (H.264)**, sem áudio (o site nunca toca som).
- **Tamanhos:** capas 2000 × 1500 (4:3); galeria até 1700 px no lado maior; plantas 2000 px no lado maior,
  só o desenho; prévias de compartilhamento 1200 × 630 em JPG (`img/og/`).
- **Converter foto** (ImageMagick): `magick entrada.png -resize 1700x1700\> -quality 82 saida.webp`
- **Converter vídeo** (ffmpeg):
  ```
  ffmpeg -i entrada.mp4 -an -vf "scale='min(1280,iw)':-2,fps=30" -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p -movflags +faststart saida.mp4
  ```
- **Poster do vídeo:** `ffmpeg -ss 14 -i video.mp4 -frames:v 1 -vf "scale='min(1700,iw)':-2" video-poster.webp`
- Trocar uma foto mantendo o nome: quem já visitou pode levar até 7 dias para ver a nova (cache).

---

## 7. Ajustes finos

| ajuste | onde |
|---|---|
| Tempo do texto sobre o vídeo do topo | `TEXTO_SEG` em `js/hero.js` |
| Movimento da galeria em mosaico | `GM_AMP` (deslocamento) e `GM_SPEED` (velocidade de cada coluna) em `js/site.js`; espaço entre fotos: `--gm-gap` em `.gm` no CSS |
| Velocidade das faixas de clientes | `PAT_SEG` (segundos por cliente) em `clientes()` no `js/site.js` |
| Velocidade da transição de página | `T_FECHA` e `T_LIMPA` em `js/site.js` (`T_LIMPA` precisa ser ≥ `T_FECHA` + 1090 ms) |
| Velocidade dos números | `COUNT_MS` e `COUNT_STEP` em `js/site.js` |
| Animação da obra | `DUR`, `FLOORS`, `FLOOR`, `PH` em `js/obra.js`; `PLAN_T` e `ROT` em `js/planta.js` |
| Proporção dos painéis de diferenciais | `flex:6` de `.dif.on` no CSS e `OPEN=6` no JS (mudar os dois) |
| Quando as revelações começam ao rolar | `rootMargin` do `IntersectionObserver` em `js/site.js` |

---

## 8. Tráfego, Google e cookies — como configurar

Nada disso tem custo. Tudo é configurado no **`site/js/config.js`** + painéis gratuitos; depois é só dar push.

### 8.1 Ver as visitas — Cloudflare Web Analytics (recomendado, sem cookies)
1. No projeto da Cloudflare Pages → **Métricas** → **Web Analytics** → ativar.
2. Pronto: visitas por página, origem (Google, Instagram, link direto), país e aparelho.

Não usa cookies, então **não precisa de aviso de cookies**. Se a Cloudflare pedir para colar um script, copie só o
**token** dele para `cloudflareAnalytics` no `config.js`.

> O painel "Visão geral" do domínio conta *solicitações* (cada foto, fonte, script e robôs) — por isso os números são
> bem maiores que o de visitas reais. Para saber quantas pessoas vieram, use o Web Analytics.

### 8.2 Aparecer no Google — Google Search Console
Mostra por quais pesquisas as pessoas chegam, em que posição o site aparece e se há páginas com erro.

**Enquanto estiver no endereço temporário (`platinum-7w1.pages.dev`):**
1. search.google.com/search-console → **Adicionar propriedade** → **Prefixo do URL** → `https://platinum-7w1.pages.dev/`.
2. Método **Tag HTML**: copie só o código de dentro de `content="..."` para `googleVerificacao` no `config.js`, dê push e, quando estiver no ar, clique em **Verificar**.
3. **Sitemaps** → envie `sitemap.xml`.
4. Opcional: **Inspeção de URL** → endereço da home → **Solicitar indexação**.

**Quando tiver o domínio próprio:**
1. Cloudflare Pages → projeto → **Domínios personalizados** → adicione o domínio (com o DNS na Cloudflare, é automático).
2. No `config.js`, troque o **`url`** pelo domínio (escolha com ou sem www e use sempre o mesmo) e publique.
3. Em **Regras → Regras de redirecionamento**, redirecione a outra versão (sem www → com www, ou o contrário).
4. No Search Console, adicione uma propriedade **Domínio** (verificação automática pela Cloudflare) e envie o `sitemap.xml` de novo.

O endereço temporário continua funcionando, mas passa a apontar o Google para o domínio novo.

### 8.3 Google Analytics 4 (opcional, mais detalhado)
1. analytics.google.com → criar propriedade → **Fluxo de dados da Web** com o endereço do site.
2. Copie o **ID da métrica** (`G-XXXXXXXXXX`) para `ga4` no `config.js` e publique.
3. Em **Administrador → Eventos**, marque **`clique_whatsapp`** como evento-chave (é a conversão do site).
4. **Administrador → Retenção de dados** → 14 meses (é o que diz a Política de Privacidade).

Eventos enviados: `page_view` (cada página), `clique_whatsapp`, `clique_telefone`, `clique_email`, `clique_instagram`,
`clique_artista` — cada um com `local` (de onde veio o clique).

**Ao preencher o `ga4`, o aviso de cookies liga sozinho** (o Analytics usa cookies e a LGPD exige pedir antes).

### 8.4 Pixel da Meta (só se for anunciar no Instagram/Facebook)
Copie o número do Pixel para `metaPixel` no `config.js`. Ele só carrega depois do "sim" para Marketing no aviso de cookies.
Sem anúncios pagos, deixe vazio.

### 8.5 Cookies e LGPD — como funciona
- Com `ga4` e `metaPixel` vazios: o site **não usa cookies** e **não mostra aviso**.
- Com algum deles preenchido: na primeira visita aparece o aviso (**Aceitar**, **Recusar**, **Personalizar** — Análise e
  Marketing separados). Antes da resposta, o Google fica no Modo de Consentimento v2 com tudo negado. A escolha vale
  12 meses; **Preferências de cookies** (rodapé e Política) reabre o aviso.
- A **Política de Privacidade e de Cookies** (`/privacidade`) se ajusta sozinha ao que está ligado no `config.js` e puxa
  de lá razão social, CNPJ, e-mail do encarregado (`emailPrivacidade`, ou o `email`), nome do encarregado e foro.
  **Peça para um advogado revisar antes de publicar.** Se o site ganhar formulário, newsletter ou outra ferramenta, ela precisa ser atualizada.

### 8.6 O que já está pronto para o Google (SEO)
- Título, descrição e endereço canônico próprios em cada página e projeto.
- Prévia de link com imagem 1200 × 630 por página (`img/og/`).
- Dados estruturados (schema.org): a empresa (serviço profissional, área atendida, Instagram), o site, a trilha de
  navegação e cada projeto, com fotos e cidade.
- `sitemap.xml` com todas as páginas e fotos (ajuda no Google Imagens) e `robots.txt`.
- Página não encontrada com 404 de verdade e "não indexar".

---

## 9. Pendências antes de publicar de vez

- [ ] **Telefone, WhatsApp e Instagram** no `index.html` ainda são de exemplo: `(xx) xxxxx-xxxx`, `wa.me/xxxxxxxxxxxxx`, `@premium`.
- [ ] **`config.js`:** `telefone`, `email`, `razaoSocial`, `cnpj`, `instagram` (aparecem no Google e na Política).
- [ ] **Política de Privacidade** revisada por advogado.
- [ ] **Banner dos artistas:** nome e @ da 3ª pessoa da esquerda (linha comentada no `ARTISTAS`) e o @ do Dhonatan Coelho.
- [ ] **Fontes Artifakt Element** em `site/fonts/` (opcional, para não depender do servidor da Autodesk).
- [ ] **Search Console** verificado e `sitemap.xml` enviado; **Web Analytics** ativado.
- [ ] Quando houver domínio próprio: trocar o `url` no `config.js` e seguir o item 8.2.
