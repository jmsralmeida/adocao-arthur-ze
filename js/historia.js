(function () {
  const id = document.body.dataset.cao;
  const cao = window.CAES[id];
  const outroId = id === "arthur" ? "ze" : "arthur";
  const outro = window.CAES[outroId];
  const cfg = window.CONFIG;
  const $ = (s) => document.querySelector(s);
  const BASE = (document.documentElement.dataset.base || "");
  const abs = (src) => BASE + src.replace(/^\//, "");

  const passos = [...cao.passos, { final: true }];
  const total = passos.length;
  let atual = 0;

  // ---------- render ----------
  function midiaHTML(p) {
    const fotos = p.video ? [] : p.fotos || [];
    const classes = ["slide-midia", p.video || fotos.length === 1 ? "uma" : "", fotos.length > 1 ? "com-duas" : ""].join(" ");
    let h = `<div class="${classes}">`;
    if (p.video) {
      h += `<span class="polaroid p0"><video src="${abs(p.video)}" poster="${abs(p.poster)}" muted loop playsinline preload="none"></video></span>`;
    }
    fotos.forEach((f, i) => {
      h += `<span class="polaroid p${i}"><img src="${abs(f)}" alt="Foto do ${cao.nome}" loading="${i ? "lazy" : "eager"}"></span>`;
    });
    if (p.ilustra) h += `<span class="sticker"><img src="${abs(p.ilustra)}" alt="Ilustração: ${p.titulo}" loading="lazy"></span>`;
    return h + "</div>";
  }

  function finalHTML() {
    const ficha = cao.ficha
      .filter(([, v]) => cfg.MOSTRAR_PENDENTES || !v.includes("⟦"))
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${marcar(v)}</dd></div>`).join("");
    const whats = window.Compartilhar.botoesWhats(id);
    const insta = cfg.INSTAGRAM ? `<a class="btn btn-claro" href="https://instagram.com/${cfg.INSTAGRAM}" target="_blank" rel="noopener"><i class="fa-brands fa-instagram" aria-hidden="true"></i> @${cfg.INSTAGRAM}</a>` : "";
    return `
      <div class="final">
        <div class="final-ilustra"><img src="${BASE}assets/ilustra/nos-adota.webp" alt="Ilustração: Arthur e Zé perguntando 'me adota?'"></div>
        <h2 class="titulo-mao">Me adota?</h2>
        <p class="lead">Será que o meu lar é com você? Estou em ${cfg.CIDADE}.</p>
        ${jeitoHTML()}
        <dl class="ficha" id="ficha">${ficha}</dl>
        <div class="acoes">
          <h3 class="titulo-mao">Quer me adotar? Chama no WhatsApp:</h3>${whats}${insta}
          <h3 class="titulo-mao">Não pode adotar? Ajuda assim:</h3>
          <button class="btn btn-compartilhar" id="btn-card"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i> Compartilhar o ${cao.nome}</button>
          <p class="nota">Imagem pronta com foto e informações para WhatsApp, Instagram, Facebook e TikTok.</p>
        </div>
        <a class="outro-cao" href="${BASE}${outroId}/index.html">
          <img src="${abs(outro.capa)}" alt="">
          <span><small>Conheça também</small><strong class="titulo-mao">${outro.nome}, ${outro.descricao} →</strong></span>
        </a>
        <a class="btn btn-claro voltar-home" href="${BASE}index.html"><i class="fa-solid fa-house" aria-hidden="true"></i> Voltar para o início</a>
      </div>`;
  }

  function jeitoHTML() {
    const tags = (cao.jeito || []).filter((t) => cfg.MOSTRAR_PENDENTES || !t.includes("⟦"));
    return tags.length ? `<ul class="jeito">${tags.map((t) => `<li>${marcar(t)}</li>`).join("")}</ul>` : "";
  }

  function marcar(t) {
    return t.replace(/⟦([^⟧]*)⟧/g, (_, s) => (cfg.MOSTRAR_PENDENTES ? `<mark class="pendente">${s}</mark>` : ""));
  }

  const trilho = document.createElement("div");
  trilho.className = "trilho";
  trilho.innerHTML = passos.map((p, i) => `
    <section class="slide" aria-label="Passo ${i + 1} de ${total}" ${i ? 'aria-hidden="true"' : ""}>
      ${p.final ? finalHTML() : `${midiaHTML(p)}<div class="slide-texto"><h2 class="titulo-mao">${p.titulo}</h2><p>${marcar(p.texto)}</p></div>`}
    </section>`).join("");
  $("#slides").appendChild(trilho);
  $("#progresso").innerHTML = passos.map(() => "<span></span>").join("");
  const slides = [...trilho.children];
  const barras = [...$("#progresso").children];

  // ---------- navegação ----------
  function ir(n, { historico = true } = {}) {
    atual = Math.max(0, Math.min(total - 1, n));
    trilho.style.transform = `translateX(${-atual * 100}%)`;
    barras.forEach((b, i) => b.classList.toggle("feito", i <= atual));
    slides.forEach((s, i) => {
      s.setAttribute("aria-hidden", i !== atual);
      s.querySelectorAll("video").forEach((v) => (i === atual ? v.play().catch(() => {}) : v.pause()));
    });
    $("#contador").textContent = `${atual + 1}/${total}`;
    $("#anterior").disabled = atual === 0;
    $("#proximo").disabled = atual === total - 1;
    if (atual > 0) $("#dica").style.visibility = "hidden";
    document.dispatchEvent(new CustomEvent("historia:passo", { detail: { passo: atual + 1, total } }));
    if (historico) history.replaceState(null, "", atual ? `#${atual + 1}` : location.pathname);
  }
  $("#ver-ficha").onclick = () => ir(total - 1);
  $("#anterior").onclick = () => ir(atual - 1);
  $("#proximo").onclick = () => ir(atual + 1);
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") ir(atual + 1);
    if (e.key === "ArrowLeft") ir(atual - 1);
  });

  // swipe com pointer events (funciona em toque e mouse)
  let x0 = null, y0 = 0, dx = 0, horizontal = null;
  const area = $("#slides");
  area.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a,button,textarea")) return;
    x0 = e.clientX; y0 = e.clientY; dx = 0; horizontal = null;
  });
  area.addEventListener("pointermove", (e) => {
    if (x0 === null) return;
    const ddx = e.clientX - x0, ddy = e.clientY - y0;
    if (horizontal === null && Math.abs(ddx) + Math.abs(ddy) > 8) horizontal = Math.abs(ddx) > Math.abs(ddy);
    if (!horizontal) return;
    dx = ddx;
    trilho.classList.add("arrastando");
    trilho.style.transform = `translateX(calc(${-atual * 100}% + ${dx}px))`;
  });
  const soltar = () => {
    if (x0 === null) return;
    trilho.classList.remove("arrastando");
    const limite = area.clientWidth * 0.18;
    if (horizontal && dx < -limite) ir(atual + 1);
    else if (horizontal && dx > limite) ir(atual - 1);
    else ir(atual, { historico: false });
    x0 = null;
  };
  area.addEventListener("pointerup", soltar);
  area.addEventListener("pointercancel", soltar);
  area.addEventListener("pointerleave", soltar);

  // card de compartilhamento
  trilho.addEventListener("click", (e) => {
    if (e.target.closest("#btn-card")) window.Compartilhar.abrir(id);
  });

  const inicial = parseInt(location.hash.slice(1), 10);
  ir(Number.isFinite(inicial) ? inicial - 1 : 0, { historico: false });
})();
