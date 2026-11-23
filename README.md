# Arthur e Zé procuram um lar

Site estático (HTML, CSS e JS puros, sem build) para divulgar a adoção do Arthur e do Zé.

## Páginas
- `/` home: escolher a história de um dos dois
- `/arthur` e `/ze`: história em passos (setas, deslizar ou ← →), ficha e contato no final
  - Dá pra abrir direto num passo: `/arthur#4`
  - Dica: gere um QR code diferente para cada plaquinha (`/arthur` e `/ze`)

## Onde editar
Todo o conteúdo fica em `js/dados.js`:
- `CONFIG`: endereço do site, cidade, WhatsApp, Instagram
- `CAES.arthur` / `CAES.ze`: textos de cada passo, fotos, ilustração, vídeo, características (`jeito`) e ficha
- Trechos entre ⟦ ⟧ são pendências e aparecem em amarelo. Com `MOSTRAR_PENDENTES: false` as linhas pendentes da ficha somem.

## Compartilhar
No final de cada história, o botão gera um card (imagem 1080x1350) com foto, características e contato,
mais um texto pronto. No celular abre o menu de compartilhar do sistema (Web Share API, com a imagem);
no computador oferece baixar a imagem e copiar o texto.

## Métricas (Google Analytics 4)
Cole o ID de medição em `js/dados.js` → `CONFIG.GA_ID` (ex.: `"G-AB12CD34EF"`). Vazio = sem analytics e sem aviso de cookies.
O código fica em `js/analytics.js` (gtag.js direto, sem Tag Manager) e envia:

| Evento | Quando | Parâmetros |
|---|---|---|
| `passo_historia` | cada passo da história visto (1x por visita) | `cao`, `passo`, `total` |
| `historia_concluida` | chegou na ficha final | `cao` |
| `abrir_compartilhar` | abriu o card de compartilhar | `cao` |
| `share` | compartilhou | `cao`, `method` (whatsapp, instagram, facebook, tiktok, nativo, copiar, baixar) |
| `contato_whatsapp` | clicou pra falar com alguém | `cao`, `pessoa` |
| `escolher_historia` / `indicar` | cliques na home | `cao` |

Os links nos textos compartilhados levam `?utm_source=whatsapp|facebook|compartilhado&utm_medium=compartilhar`,
então as visitas que vieram de compartilhamento aparecem em Aquisição de tráfego.
Para separar quem veio da plaquinha, use no QR: `/arthur/?utm_source=plaquinha&utm_medium=qr`.

No GA4: crie as dimensões personalizadas (escopo evento) `cao`, `passo`, `pessoa` e `method`, marque
`contato_whatsapp` como evento principal e, em Fluxo de dados → Medição otimizada, desligue
"Mudanças de página com base no histórico" (a história troca o `#passo` na URL e inflaria as visualizações).

## Publicação (GitHub Pages)
Todo commit na `main` publica o site automaticamente pelo workflow `.github/workflows/pages.yml`.
Endereço: https://jmsralmeida.github.io/adocao-arthur-ze/

- Home: https://jmsralmeida.github.io/adocao-arthur-ze/
- Arthur (QR da plaquinha dele): https://jmsralmeida.github.io/adocao-arthur-ze/arthur/
- Zé (QR da plaquinha dele): https://jmsralmeida.github.io/adocao-arthur-ze/ze/

Na primeira vez, se o workflow falhar no passo de Pages: em Settings → Pages, escolha "Source: GitHub Actions" e rode o workflow de novo.

## Testar localmente
`npx serve .` ou `python3 -m http.server` nesta pasta e abra http://localhost:8000
