/*
 * Google Analytics 4 (gtag.js direto, sem Tag Manager).
 * O ID de medição fica em js/dados.js -> CONFIG.GA_ID ("G-XXXXXXXXXX").
 * Vazio = nada é carregado e nenhum aviso aparece.
 *
 * Eventos enviados (todos com o parâmetro "cao" = arthur | ze | site):
 *   passo_historia     cada passo da história visto pela 1ª vez (param "passo")
 *   historia_concluida chegou na ficha final da história
 *   abrir_compartilhar abriu o card de compartilhar do cão
 *   share              compartilhou (param "method" = whatsapp | instagram | facebook | tiktok | nativo | copiar | baixar)
 *   contato_whatsapp   clicou pra falar com alguém (param "pessoa")
 *   escolher_historia  na home, clicou na história de um dos dois
 *   indicar            na home, clicou em "Indicar o Arthur/Zé"
 */
(function () {
  const cfg = window.CONFIG || {};
  const ID = (cfg.GA_ID || "").trim();
  const CHAVE = "analytics-escolha"; // "sim" | "nao"
  const ler = () => { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } };
  const gravar = (v) => { try { localStorage.setItem(CHAVE, v); } catch (e) {} };

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  const ativo = /^G-[A-Z0-9]+$/i.test(ID) && !/^G-X+$/i.test(ID);
  const cao = document.body.dataset.cao || "site";

  // API usada pelos outros scripts. Sem ID, vira no-op.
  window.Medir = function (evento, params) {
    if (!ativo) return;
    gtag("event", evento, Object.assign({ cao }, params || {}));
  };
  if (!ativo) return;

  // ---------- consentimento (LGPD) ----------
  // Sem anúncios: armazenamento de anúncios sempre negado.
  // Estatística liberada por padrão, com aviso e opção de recusar (fica salvo no navegador).
  const recusou = ler() === "nao";
  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: recusou ? "denied" : "granted",
  });

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
  document.head.appendChild(s);
  gtag("js", new Date());
  gtag("config", ID, { allow_google_signals: false, allow_ad_personalization_signals: false });

  if (!ler()) avisoCookies();

  function avisoCookies() {
    const el = document.createElement("div");
    el.className = "aviso-cookies";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Aviso de cookies");
    el.innerHTML = `
      <p>🐾 Usamos cookies de estatística (Google Analytics) só pra saber quantas pessoas conheceram o Arthur e o Zé. Nada de anúncios.</p>
      <div><button class="sim">Tudo bem</button><button class="nao">Não quero</button></div>`;
    el.querySelector(".sim").onclick = () => { gravar("sim"); el.remove(); };
    el.querySelector(".nao").onclick = () => {
      gravar("nao");
      gtag("consent", "update", { analytics_storage: "denied" });
      el.remove();
    };
    const por = () => document.body.appendChild(el);
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", por) : por();
  }

  // ---------- passos da história (disparado por js/historia.js) ----------
  const vistos = new Set();
  document.addEventListener("historia:passo", (e) => {
    const { passo, total } = e.detail;
    if (vistos.has(passo)) return;
    vistos.add(passo);
    window.Medir("passo_historia", { passo, total });
    if (passo === total) window.Medir("historia_concluida", { total });
  });

  // ---------- cliques (delegação, pega também o modal criado depois) ----------
  const redes = { whats: "whatsapp", insta: "instagram", face: "facebook", tiktok: "tiktok" };
  document.addEventListener("click", (e) => {
    const el = e.target.closest("a,button");
    if (!el) return;
    const href = el.getAttribute("href") || "";
    const compart = (method) => window.Medir("share", { method, content_type: cao === "site" ? "site" : "cao", item_id: cao });

    // falar com alguém: wa.me/<número>
    const num = href.match(/wa\.me\/(\d+)/);
    if (num) {
      const p = (cfg.WHATSAPP || []).find((w) => w.numero === num[1]);
      return window.Medir("contato_whatsapp", { pessoa: p ? p.nome : num[1] });
    }
    if (el.id === "btn-card") return window.Medir("abrir_compartilhar");
    if (el.dataset.rede) return compart(redes[el.dataset.rede] || el.dataset.rede); // home
    const doModal = { "r-whats": "whatsapp", "r-insta": "instagram", "r-face": "facebook", "r-tiktok": "tiktok",
      "m-share": "nativo", "m-copiar": "copiar", "m-baixar": "baixar" }[el.id];
    if (doModal) return compart(doModal);
    if (el.matches("[data-compartilhar-site]")) return compart("nativo");

    const escolha = el.closest(".escolha-cao");
    if (escolha) return window.Medir("escolher_historia", { cao: escolha.classList.contains("ze") ? "ze" : "arthur" });
    if (el.matches(".btn-arthur, .btn-ze")) return window.Medir("indicar", { cao: el.matches(".btn-ze") ? "ze" : "arthur" });
  }, true);
})();
