/* ============================================================
   CONFIGURAÇÃO DO SITE — domínio, códigos do Google/Meta e textos para buscadores.
   É lido pelo navegador e também pela Function da Cloudflare (_worker.js), que monta o título, a prévia de
   WhatsApp/Instagram, o sitemap.xml e o robots.txt de cada página. Mudou aqui? É só dar push.
   ============================================================ */
const SITE = {
  /* endereço oficial, sem barra no fim. Por enquanto é o endereço temporário da Cloudflare;
     quando o domínio próprio estiver ligado, troque aqui (ex.: "https://www.rsplatinum.com.br") e dê push.
     O Google só indexa este endereço: qualquer outro (prévias da Cloudflare etc.) sai como "não indexar". */
  url: "https://platinum-7w1.pages.dev",

  nome: "Rafael Schmitt Platinum",
  nomeCurto: "Platinum",
  descricaoEmpresa: "Escritório de arquitetura de alto padrão especializado em edifícios residenciais verticais no litoral de Santa Catarina.",

  /* ---------- medição (deixe "" para desligar) ---------- */
  /* Cloudflare Web Analytics — gratuito, SEM cookies (não precisa de aviso de cookies).
     Se o site está na Cloudflare Pages, basta ligar no painel (projeto → Métricas → Web Analytics) e deixar vazio aqui.
     Só preencha se a Cloudflare pedir o "token" do script (site fora da Pages): o código entre aspas em data-cf-beacon. */
  cloudflareAnalytics: "",
  ga4: "",            // Google Analytics 4 — "ID da métrica", formato G-XXXXXXXXXX
  metaPixel: "",      // Pixel da Meta (Facebook/Instagram Ads) — só números, ex.: "123456789012345"

  /* Google Search Console — só se escolher o método "tag HTML". Cole só o código do content="...".
     (Na Cloudflare é mais fácil verificar pelo DNS; aí deixe vazio.) */
  googleVerificacao: "",

  /* ---------- dados da empresa (aparecem no Google e na Política de Privacidade) ---------- */
  telefone: "",                       // com DDI, ex.: "+5547999999999"
  email: "",                          // ex.: "contato@rsplatinum.com.br"
  emailPrivacidade: "",               // e-mail do encarregado de dados (LGPD, art. 41). Vazio = usa o "email" acima
  encarregado: "",                    // nome do encarregado de dados (DPO), se houver
  razaoSocial: "",                    // ex.: "Rafael Schmitt Arquitetura Ltda."
  cnpj: "",                           // ex.: "00.000.000/0001-00"
  instagram: "https://instagram.com/premium",
  cidade: "Itapema",
  estado: "SC",
  areaAtendida: ["Itapema", "Porto Belo", "Balneário Camboriú", "Bombinhas", "Santa Catarina"],
  foro: "Itapema/SC",                 // foro da Política de Privacidade
  fundacao: "2000",                   // "Há 26 anos" no site → 2000

  /* imagem padrão de compartilhamento (WhatsApp, Instagram, LinkedIn): 1200 × 630 */
  imagemPadrao: "/img/og/padrao.jpg",
};

/* Título e descrição de cada página para o Google e para a prévia de links.
   Título: até ~60 caracteres. Descrição: entre ~120 e 160 caracteres.
   Os projetos usam o "intro" de cada um, no data.js. Escreva sem aspas duplas dentro do texto. */
const SEO_PAGINAS = {
  home: {
    titulo: "Rafael Schmitt Platinum | Arquitetura de alto padrão em SC",
    descricao: "Escritório de arquitetura de alto padrão com 26 anos no litoral catarinense. Edifícios residenciais e flats em Itapema, Porto Belo e região.",
  },
  estudio: {
    titulo: "Estúdio | Rafael Schmitt Platinum",
    descricao: "Há 26 anos desenhando a verticalização do litoral catarinense, do estudo de massa ao detalhe da fachada. Conheça o estúdio e o jeito de trabalhar.",
  },
  projetos: {
    titulo: "Projetos | Rafael Schmitt Platinum",
    descricao: "Edifícios residenciais e flats de alto padrão projetados pela Rafael Schmitt Platinum em Itapema, Porto Belo e no litoral de Santa Catarina.",
  },
  contato: {
    titulo: "Contato | Rafael Schmitt Platinum",
    descricao: "Fale com a Rafael Schmitt Platinum pelo WhatsApp: conte sobre o terreno, a cidade e o produto que você imagina. Atendemos Itapema, Porto Belo e SC.",
  },
  privacidade: {
    titulo: "Política de Privacidade e de Cookies | Rafael Schmitt Platinum",
    descricao: "Como a Rafael Schmitt Platinum trata dados pessoais e cookies neste site, de acordo com a LGPD: dados coletados, finalidades, direitos e contato.",
  },
  "nao-encontrada": {
    titulo: "Página não encontrada | Rafael Schmitt Platinum",
    descricao: "O endereço acessado não existe ou mudou.",
  },
};

/* Título, descrição, endereço e imagem de uma página — usado pelo navegador ao trocar de página.
   A Function (_worker.js) tem a mesma regra para quem lê o HTML direto (Google, WhatsApp). */
function seoDe(pagina, projeto){
  if (pagina === 'projeto' && projeto){
    const desc = (projeto.intro || `${projeto.cat} em ${projeto.cidade}.`).trim().replace(/\.?$/, '.');
    return {
      titulo: `${projeto.title}: ${projeto.cat} em ${projeto.cidade} | ${SITE.nome}`,
      descricao: `${desc} Projeto de arquitetura da ${SITE.nome}.`,
      caminho: `/projeto/${projeto.slug}`,
      imagem: `/img/og/${projeto.slug}.jpg`,
    };
  }
  const p = SEO_PAGINAS[pagina] || SEO_PAGINAS['nao-encontrada'];
  return { titulo: p.titulo, descricao: p.descricao, caminho: pagina === 'home' ? '/' : '/' + pagina, imagem: SITE.imagemPadrao };
}
