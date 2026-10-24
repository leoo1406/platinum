/* ============================================================
   FUNCTION DA CLOUDFLARE (Pages, "advanced mode") — roda no servidor da Cloudflare a cada visita.
   Não precisa mexer aqui no dia a dia: tudo vem do js/config.js e do js/data.js.

   O que ela faz:
   1. Endereços limpos: /estudio, /projetos, /projeto/legacy… entregam o index.html com o título, a descrição,
      a imagem de compartilhamento e os dados para o Google daquela página (o WhatsApp, o Instagram e o
      Facebook leem isso direto do HTML, sem rodar JavaScript).
   2. Endereço que não existe responde 404 de verdade (e o site mostra a página "não encontrada").
   3. Gera o /sitemap.xml e o /robots.txt a partir dos projetos do data.js.
   4. Cabeçalhos de segurança e cache. Endereços de prévia saem com "noindex".

   A regra de título/descrição é a mesma do seoDe() do config.js (o navegador usa aquela; esta é a do servidor).
   Publicação: push no GitHub (diretório de saída da Cloudflare = site). O _worker.js vai junto e é ativado sozinho.
   Endereços de prévia de outras branches (xxxx.platinum-7w1.pages.dev) saem com "noindex".
   ============================================================ */

const PAGINAS = ['estudio', 'projetos', 'contato', 'privacidade'];
const SEG = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    let p = url.pathname;
    try { p = decodeURIComponent(p); } catch (e) {}

    if (req.method !== 'GET' && req.method !== 'HEAD') return env.ASSETS.fetch(req);

    /* barra no fim e /index.html → endereço limpo */
    if (p === '/index.html' || p === '/index') return redir(url, '/');
    if (p.length > 1 && p.endsWith('/')) return redir(url, p.replace(/\/+$/, ''));

    if (p === '/sitemap.xml') return xml(await sitemap(env, url), 'application/xml');
    if (p === '/robots.txt') return xml(await robots(env, url), 'text/plain');

    /* arquivos (fotos, css, js, fontes…): entrega direto, com cache */
    if (/\.[a-z0-9]{2,5}$/i.test(p)) {
      const res = await env.ASSETS.fetch(req);
      /* arquivo que não existe: a Cloudflare devolveria a home; aqui vira 404 de verdade */
      if (!/\.html?$/i.test(p) && (res.headers.get('Content-Type') || '').includes('text/html')) return new Response('Arquivo não encontrado', { status: 404, headers: SEG });
      return comCabecalhos(res, p, url, env);
    }

    /* páginas */
    const d = await dados(env, url);
    const partes = p.replace(/^\/+/, '').split('/');
    let pagina = partes[0] || 'home', projeto = null, status = 200;
    if (pagina === 'projeto') {
      projeto = partes.length === 2 ? d.PROJECTS.find(x => x.slug === partes[1]) : null;
      if (!projeto) { pagina = 'nao-encontrada'; status = 404; }
    } else if (pagina !== 'home' && (!PAGINAS.includes(pagina) || partes.length > 1)) { pagina = 'nao-encontrada'; status = 404; }

    const base = await env.ASSETS.fetch(new Request(new URL('/', url), { headers: req.headers }));
    let html = await base.text();
    html = aplicaSEO(html, await blocoSEO(d, pagina, projeto, env, url));
    const h = new Headers({ 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate', ...SEG });
    if (!ehOficial(d, url) || pagina === 'nao-encontrada') h.set('X-Robots-Tag', 'noindex');
    return new Response(req.method === 'HEAD' ? null : html, { status, headers: h });
  },
};

/* ---------- respostas ---------- */
const redir = (url, para) => Response.redirect(new URL(para + url.search, url).toString(), 301);
const xml = (txt, tipo) => new Response(txt, { headers: { 'Content-Type': tipo + '; charset=utf-8', 'Cache-Control': 'public, max-age=3600', ...SEG } });
async function comCabecalhos(res, p, url, env) {
  const r = new Response(res.body, res);
  for (const [k, v] of Object.entries(SEG)) r.headers.set(k, v);
  if (res.ok && p.startsWith('/fonts/')) r.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  else if (res.ok && p.startsWith('/img/')) r.headers.set('Cache-Control', 'public, max-age=604800');
  if (!(await ehOficialUrl(env, url))) r.headers.set('X-Robots-Tag', 'noindex');
  return r;
}

/* ---------- leitura do config.js e do data.js (lidos uma vez e guardados enquanto a Function estiver ativa) ---------- */
let CACHE = null;
async function dados(env, url) {
  if (CACHE) return CACHE;
  const ler = async f => (await env.ASSETS.fetch(new URL(f, url))).text();
  const [cfg, data] = await Promise.all([ler('/js/config.js'), ler('/js/data.js')]);
  CACHE = { SITE: literal(cfg, 'SITE'), SEO_PAGINAS: literal(cfg, 'SEO_PAGINAS'), PROJECTS: literal(data, 'PROJECTS') };
  return CACHE;
}
const oficial = d => (d.SITE.url || '').replace(/\/+$/, '');
const ehOficial = (d, url) => !oficial(d) || new URL(oficial(d)).host === url.host;
const ehOficialUrl = async (env, url) => ehOficial(await dados(env, url), url);
const raiz = (d, url) => oficial(d) || url.origin;

/* lê o valor de "const NOME = …" de um arquivo .js (objetos, listas, textos, números, true/false/null, comentários) */
function literal(src, nome) {
  const m = new RegExp('(?:const|let|var)\\s+' + nome + '\\s*=').exec(src);
  if (!m) throw new Error('Não achei ' + nome);
  let i = m.index + m[0].length;
  const pula = () => {
    for (;;) {
      while (/\s/.test(src[i])) i++;
      if (src.startsWith('//', i)) { i = src.indexOf('\n', i); if (i < 0) i = src.length; }
      else if (src.startsWith('/*', i)) i = src.indexOf('*/', i) + 2;
      else return;
    }
  };
  const valor = () => {
    pula();
    const c = src[i];
    if (c === '{') {
      i++; const o = {};
      for (;;) {
        pula(); if (src[i] === '}') { i++; return o; }
        let k; if (src[i] === '"' || src[i] === "'") k = texto(); else { const km = /^[\w$]+/.exec(src.slice(i)); k = km[0]; i += k.length; }
        pula(); i++; /* : */ o[k] = valor(); pula(); if (src[i] === ',') i++;
      }
    }
    if (c === '[') {
      i++; const a = [];
      for (;;) { pula(); if (src[i] === ']') { i++; return a; } a.push(valor()); pula(); if (src[i] === ',') i++; }
    }
    if (c === '"' || c === "'" || c === '`') return texto();
    const tm = /^(-?\d+(?:\.\d+)?|true|false|null)/.exec(src.slice(i));
    if (!tm) throw new Error('Valor inesperado em ' + nome + ': ' + src.slice(i, i + 30));
    i += tm[0].length;
    return tm[0] === 'true' ? true : tm[0] === 'false' ? false : tm[0] === 'null' ? null : Number(tm[0]);
  };
  const texto = () => {
    const q = src[i++]; let s = '';
    while (src[i] !== q) {
      if (src[i] === '\\') { const n = src[++i]; s += n === 'n' ? '\n' : n === 't' ? '\t' : n; i++; }
      else s += src[i++];
    }
    i++; return s;
  };
  return valor();
}

/* ---------- SEO de cada página (mesma regra do seoDe() do config.js) ---------- */
function seoDe(d, pagina, projeto) {
  const { SITE, SEO_PAGINAS } = d;
  if (pagina === 'projeto' && projeto) {
    const desc = (projeto.intro || `${projeto.cat} em ${projeto.cidade}.`).trim().replace(/\.?$/, '.');
    return { titulo: `${projeto.title}: ${projeto.cat} em ${projeto.cidade} | ${SITE.nome}`, descricao: `${desc} Projeto de arquitetura da ${SITE.nome}.`,
             caminho: `/projeto/${projeto.slug}`, imagem: `/img/og/${projeto.slug}.jpg` };
  }
  const s = SEO_PAGINAS[pagina] || SEO_PAGINAS['nao-encontrada'];
  return { titulo: s.titulo, descricao: s.descricao, caminho: pagina === 'home' ? '/' : '/' + pagina, imagem: SITE.imagemPadrao };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
async function existe(env, url, caminho) { try { return (await env.ASSETS.fetch(new Request(new URL(caminho, url), { method: 'HEAD' }))).ok; } catch (e) { return false; } }

async function blocoSEO(d, pagina, projeto, env, url) {
  const { SITE } = d, R = raiz(d, url), abs = u => /^https?:/.test(u) ? u : R + u;
  const s = seoDe(d, pagina, projeto);
  const img = projeto && !(await existe(env, url, s.imagem)) ? projeto.cover : s.imagem;
  const empresa = {
    '@type': 'ProfessionalService', '@id': R + '/#empresa', name: SITE.nome, description: SITE.descricaoEmpresa, url: R + '/',
    logo: abs('/img/marca.png'), image: abs(SITE.imagemPadrao),
    ...(SITE.fundacao && { foundingDate: SITE.fundacao }), ...(SITE.telefone && { telephone: SITE.telefone }),
    ...(SITE.email && { email: SITE.email }), ...(SITE.razaoSocial && { legalName: SITE.razaoSocial }), ...(SITE.cnpj && { taxID: SITE.cnpj }),
    address: { '@type': 'PostalAddress', addressLocality: SITE.cidade, addressRegion: SITE.estado, addressCountry: 'BR' },
    areaServed: (SITE.areaAtendida || []).map(n => ({ '@type': n === 'Santa Catarina' ? 'State' : 'City', name: n })),
    knowsAbout: ['Arquitetura', 'Arquitetura vertical', 'Edifícios residenciais', 'Projetos de alto padrão'],
    ...(SITE.instagram && { sameAs: [SITE.instagram] }),
  };
  const trilha = itens => ({ '@type': 'BreadcrumbList', itemListElement: itens.map((it, k) => ({ '@type': 'ListItem', position: k + 1, name: it[0], item: abs(it[1]) })) });
  const ld = [empresa];
  if (pagina === 'home') ld.push({ '@type': 'WebSite', '@id': R + '/#site', url: R + '/', name: SITE.nome, inLanguage: 'pt-BR', publisher: { '@id': R + '/#empresa' } });
  else if (pagina === 'projeto') {
    ld.push(trilha([['Início', '/'], ['Projetos', '/projetos'], [projeto.title, s.caminho]]));
    ld.push({ '@type': 'CreativeWork', '@id': abs(s.caminho) + '#projeto', name: projeto.title, url: abs(s.caminho), description: s.descricao,
      inLanguage: 'pt-BR', genre: projeto.cat, image: [projeto.cover, ...(projeto.gallery || []).slice(0, 5)].map(abs), creator: { '@id': R + '/#empresa' },
      locationCreated: { '@type': 'Place', name: projeto.title, address: { '@type': 'PostalAddress', ...(projeto.endereco && { streetAddress: projeto.endereco }), addressLocality: projeto.cidade, addressRegion: SITE.estado, addressCountry: 'BR' } } });
  } else if (pagina !== 'nao-encontrada') ld.push(trilha([['Início', '/'], [s.titulo.split(' | ')[0], s.caminho]]));

  return [
    `<title>${esc(s.titulo)}</title>`,
    `<meta name="description" content="${esc(s.descricao)}">`,
    pagina === 'nao-encontrada' ? `<meta name="robots" content="noindex, follow">` : `<link rel="canonical" href="${esc(abs(s.caminho))}">`,
    SITE.googleVerificacao ? `<meta name="google-site-verification" content="${esc(SITE.googleVerificacao)}">` : '',
    `<meta property="og:type" content="website">`, `<meta property="og:locale" content="pt_BR">`,
    `<meta property="og:site_name" content="${esc(SITE.nome)}">`,
    `<meta property="og:title" content="${esc(s.titulo)}">`, `<meta property="og:description" content="${esc(s.descricao)}">`,
    `<meta property="og:url" content="${esc(abs(s.caminho))}">`, `<meta property="og:image" content="${esc(abs(img))}">`,
    img.endsWith('.jpg') ? `<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">` : '',
    `<meta property="og:image:alt" content="${esc(projeto ? projeto.title + ', ' + projeto.cidade : SITE.nome)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(s.titulo)}">`, `<meta name="twitter:description" content="${esc(s.descricao)}">`,
    `<meta name="twitter:image" content="${esc(abs(img))}">`,
    `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': ld }).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean).join('\n');
}

function aplicaSEO(html, bloco) {
  const a = html.indexOf('<!-- SEO:INICIO'), b = html.indexOf('<!-- SEO:FIM -->');
  if (a < 0 || b < 0) return html;
  const fimLinha = html.indexOf('\n', a) + 1;
  let out = html.slice(0, fimLinha) + bloco + '\n' + html.slice(b);
  /* o index.html já traz um robots padrão; na página não encontrada, o do bloco vale */
  if (bloco.includes('name="robots"')) out = out.replace(/<meta name="robots" content="index[^"]*">\n?/, '');
  return out;
}

/* ---------- sitemap.xml e robots.txt ---------- */
async function sitemap(env, url) {
  const d = await dados(env, url), R = raiz(d, url), abs = u => /^https?:/.test(u) ? u : R + u;
  const item = (loc, prio, freq, imgs = []) => `  <url>\n    <loc>${esc(abs(loc))}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>${imgs.map(i => `\n    <image:image><image:loc>${esc(abs(i))}</image:loc></image:image>`).join('')}\n  </url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[item('/', '1.0', 'monthly', [d.SITE.imagemPadrao]), item('/projetos', '0.9', 'monthly'),
   ...d.PROJECTS.map(x => item('/projeto/' + x.slug, '0.8', 'monthly', [x.cover, ...(x.gallery || [])])),
   item('/estudio', '0.7', 'yearly'), item('/contato', '0.7', 'yearly'), item('/privacidade', '0.2', 'yearly')].join('\n')}
</urlset>
`;
}
async function robots(env, url) {
  const d = await dados(env, url);
  if (!ehOficial(d, url)) return 'User-agent: *\nDisallow: /\n';   // endereços de prévia não entram no Google
  return `User-agent: *\nAllow: /\n\nSitemap: ${raiz(d, url)}/sitemap.xml\n`;
}
