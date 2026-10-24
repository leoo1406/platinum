/* ============================================================
   COOKIES (LGPD) + MEDIÇÃO — Google Analytics 4, Modo de Consentimento v2 e Pixel da Meta (opcional).
   Os códigos ficam no js/config.js. O Cloudflare Web Analytics não usa cookies e não depende do aviso.
   Sem GA4 nem Pixel preenchidos, o aviso de cookies nem aparece, porque o site não usa cookies de terceiros.

   Como funciona:
   - Antes de qualquer resposta, tudo fica NEGADO: o Google Analytics só manda sinais anônimos, sem gravar cookies.
   - "Aceitar" libera análise e marketing; "Recusar" mantém só o essencial; "Personalizar" escolhe um a um.
   - A escolha fica guardada por 12 meses no navegador. "Preferências de cookies", no rodapé, reabre o aviso.
   - Cada troca de página conta uma visualização no GA4 (o site muda de página sem recarregar).
   - Eventos já enviados: clique_whatsapp, clique_telefone, clique_email, clique_instagram, clique_artista.
     No GA4, marque "clique_whatsapp" como evento-chave (conversão).
   ============================================================ */
(function(){
  const CFG = (typeof SITE !== 'undefined') ? SITE : {};
  const CHAVE = 'cookies-consentimento';
  const VALIDADE = 365 * 864e5;
  const temGA = !!CFG.ga4, temMeta = !!CFG.metaPixel;
  const usaCookies = temGA || temMeta;

  /* ---------- Cloudflare Web Analytics: sem cookies, carrega sempre (não depende do aviso) ---------- */
  if (CFG.cloudflareAnalytics) {
    const cf = document.createElement('script');
    cf.defer = true; cf.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    cf.setAttribute('data-cf-beacon', JSON.stringify({ token: CFG.cloudflareAnalytics, spa: true }));
    document.head.appendChild(cf);
  }

  /* ---------- Google: consentimento padrão = negado (precisa vir antes do gtag.js) ---------- */
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ dataLayer.push(arguments); };
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted',
    wait_for_update: 500,
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', false);

  const lido = (()=>{ try{ const v = JSON.parse(localStorage.getItem(CHAVE)); return v && (Date.now() - v.data < VALIDADE) ? v : null; }catch(e){ return null; } })();
  if (lido) aplicaGoogle(lido);

  if (temGA) {
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CFG.ga4);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', CFG.ga4, { send_page_view: false });   // as visualizações são enviadas pelo site, a cada página
  }

  function aplicaGoogle(c){
    gtag('consent', 'update', {
      analytics_storage: c.analise ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied',
    });
  }

  /* ---------- Pixel da Meta: só carrega depois do "sim" para marketing ---------- */
  let metaPronto = false;
  function carregaMeta(){
    if (!temMeta || metaPronto) return; metaPronto = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
    s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', CFG.metaPixel);
    fbq('track', 'PageView');
  }
  if (lido && lido.marketing) carregaMeta();

  function salva(analise, marketing){
    const c = { analise: !!analise, marketing: !!marketing, data: Date.now(), v: 1 };
    try{ localStorage.setItem(CHAVE, JSON.stringify(c)); }catch(e){}
    aplicaGoogle(c);
    if (c.marketing) carregaMeta();
    fecha();
  }

  /* ---------- medição usada pelo site ---------- */
  window.paginaVista = function(caminho, titulo){
    if (temGA) gtag('event', 'page_view', { page_location: location.origin + caminho, page_path: caminho, page_title: titulo });
    if (metaPronto && window.fbq) fbq('track', 'PageView');
  };
  window.rastrear = function(evento, dados){
    if (temGA) gtag('event', evento, dados || {});
    if (metaPronto && window.fbq && evento === 'clique_whatsapp') fbq('track', 'Contact');
  };
  document.addEventListener('click', e=>{
    const a = e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href') || '';
    const local = a.classList.contains('wpp') ? 'botao_flutuante' : a.closest('footer') ? 'rodape' : a.closest('header') ? 'topo'
                : (a.closest('.page') || {dataset:{}}).dataset.page || '';
    const base = { link_url: h, local };
    if (/wa\.me|api\.whatsapp\.com/.test(h)) rastrear('clique_whatsapp', base);
    else if (h.startsWith('tel:')) rastrear('clique_telefone', base);
    else if (h.startsWith('mailto:')) rastrear('clique_email', base);
    else if (a.classList.contains('tg-b')) rastrear('clique_artista', { ...base, artista: a.querySelector('b')?.textContent || '' });
    else if (/instagram\.com/.test(h)) rastrear('clique_instagram', base);
  }, true);

  /* ---------- aviso de cookies ---------- */
  let caixa = null;
  function fecha(){ if (!caixa) return; caixa.classList.remove('on'); setTimeout(()=>{ caixa && (caixa.hidden = true); }, 400); }
  function abre(personalizar){
    if (!usaCookies) return;
    if (!caixa) monta();
    const c = (()=>{ try{ return JSON.parse(localStorage.getItem(CHAVE)); }catch(e){ return null; } })() || { analise: false, marketing: false };
    caixa.querySelector('#ckAnalise').checked = !!c.analise;
    caixa.querySelector('#ckMarketing').checked = !!c.marketing;
    caixa.classList.toggle('pers', !!personalizar);
    caixa.hidden = false; requestAnimationFrame(()=>caixa.classList.add('on'));
  }
  window.abrirCookies = ()=>abre(true);

  function monta(){
    caixa = document.createElement('div');
    caixa.className = 'ck'; caixa.hidden = true;
    caixa.setAttribute('role', 'dialog'); caixa.setAttribute('aria-label', 'Aviso de cookies'); caixa.setAttribute('aria-live', 'polite');
    caixa.innerHTML = `
      <p class="ck-t">Cookies</p>
      <p class="ck-x">Usamos cookies para entender como o site é usado${temMeta ? ' e medir nossos anúncios' : ''}. Você escolhe o que liberar. <a href="/privacidade" data-link>Política de Privacidade</a></p>
      <div class="ck-op">
        <label><input type="checkbox" checked disabled><span><b>Essenciais</b><small>Necessários para o site funcionar. Sempre ativos.</small></span></label>
        <label${temGA ? '' : ' hidden'}><input type="checkbox" id="ckAnalise"><span><b>Análise</b><small>Google Analytics: páginas mais vistas e de onde vêm as visitas.</small></span></label>
        <label${temMeta ? '' : ' hidden'}><input type="checkbox" id="ckMarketing"><span><b>Marketing</b><small>Medição de anúncios no Instagram e no Facebook.</small></span></label>
      </div>
      <div class="ck-b">
        <button type="button" class="ck-sim">Aceitar</button>
        <button type="button" class="ck-nao">Recusar</button>
        <button type="button" class="ck-pers">Personalizar</button>
        <button type="button" class="ck-salva">Salvar escolhas</button>
      </div>`;
    document.body.appendChild(caixa);
    caixa.querySelector('.ck-sim').onclick = ()=>salva(true, true);
    caixa.querySelector('.ck-nao').onclick = ()=>salva(false, false);
    caixa.querySelector('.ck-pers').onclick = ()=>caixa.classList.add('pers');
    caixa.querySelector('.ck-salva').onclick = ()=>salva(caixa.querySelector('#ckAnalise').checked, caixa.querySelector('#ckMarketing').checked);
    caixa.addEventListener('click', e=>{ if (e.target.closest('a[data-link]')) fecha(); });
  }

  if (usaCookies && !lido){
    const mostra = ()=>setTimeout(()=>abre(false), 1800);   // espera a abertura do site terminar
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', mostra) : mostra();
  }
})();
