(function () {
  const cfg = window.CONFIG;
  const limpo = (t) => t.replace(/⟦[^⟧]*⟧/g, "").trim();
  const fig = { arthur: "assets/figurinhas/arthur-sentado.webp", ze: "assets/figurinhas/ze-pulando.webp" };

  document.querySelectorAll("[data-cidade]").forEach((el) => (el.textContent = cfg.CIDADE));
  document.querySelectorAll("[data-compartilhar-site]").forEach((b) => (b.onclick = () => window.Compartilhar.compartilharSite()));

  // Cartões de escolha, montados a partir de js/dados.js
  document.getElementById("escolha").innerHTML = Object.entries(window.CAES).map(([id, c]) => {
    const tags = (c.jeito || []).map(limpo).filter(Boolean).slice(0, 3);
    const idade = limpo((c.ficha.find(([k]) => k === "Idade") || ["", ""])[1]);
    const minutos = Math.max(1, Math.round(c.passos.length * 0.25));
    return `
      <a class="escolha-cao ${id}" href="${id}/index.html">
        <span class="escolha-fotos">
          <span class="polaroid"><img src="${c.capa}" alt="Foto do ${c.nome}"></span>
          <img class="escolha-fig" src="${fig[id]}" alt="">
        </span>
        <span class="escolha-txt">
          <strong class="titulo-mao">${c.nome}</strong>
          <span class="escolha-desc">${c.descricao}${idade ? " · " + idade.toLowerCase() : ""}</span>
          <span class="escolha-gancho">${c.gancho || ""}</span>
          <span class="escolha-tags">${tags.map((t) => `<em>${t}</em>`).join("")}</span>
          <span class="botao-ler">Ler a história · ${c.passos.length} passos, ${minutos} min →</span>
        </span>
      </a>`;
  }).join("");

  document.getElementById("whats-home").innerHTML = window.Compartilhar.botoesWhats();
  document.getElementById("contatos").innerHTML = window.Compartilhar.botoesWhats();
  document.querySelectorAll("[data-rede]").forEach((el) => el.addEventListener("click", (e) => {
    e.preventDefault();
    window.Compartilhar.compartilharSiteEm(el.dataset.rede, el.closest(".ajuda-item").querySelector(".nota-rede"));
  }));
})();
