"""Abre o site no computador para ver o visual e a navegação.
(Abrir o index.html com duplo clique não funciona: o site precisa de um servidor.)
Este teste rápido NÃO roda a Function da Cloudflare (_worker.js): títulos por página para o Google, sitemap e 404.
Para testar igual à Cloudflare, com o Node.js instalado:   npx wrangler pages dev site

Como usar, a partir da pasta acima de "site":   python ferramentas/testar-local.py
e acesse http://localhost:8000   (porta ocupada?  python ferramentas/testar-local.py 8080)
"""
import http.server, os, sys
PORTA = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site')

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=SITE, **k)
    def send_head(self):
        url = self.path.split('?')[0].split('#')[0]
        caminho = self.translate_path(url)
        if not os.path.exists(caminho) and '.' not in os.path.basename(url):
            self.path = '/index.html'   # /projetos, /projeto/legacy... (o site mostra a página certa)
        return super().send_head()
    def log_message(self, *a): pass

class Servidor(http.server.ThreadingHTTPServer):
    allow_reuse_address = True

with Servidor(('', PORTA), Handler) as s:
    print(f'Site em http://localhost:{PORTA}  (Ctrl+C para parar)'); s.serve_forever()
