window.Compartilhar = (function () {
  const cfg = window.CONFIG;
  const limpo = (t) => t.replace(/⟦[^⟧]*⟧/g, "").replace(/\s+/g, " ").trim();
  const urlDo = (id) => `${cfg.SITE_URL.replace(/\/$/, "")}/${id || ""}`;
  // Links nos textos compartilhados levam utm_* pra o Analytics saber de onde veio a visita.
  // O card (imagem) continua com o endereço limpo.
  const urlCompart = (id, origem = "compartilhado") => `${urlDo(id)}${id ? "/" : ""}?utm_source=${origem}&utm_medium=compartilhar`;
  const comOrigem = (t, origem) => t.replace(/utm_source=compartilhado/g, `utm_source=${origem}`);
  const contato = () => cfg.WHATSAPP.map((w) => `${w.nome} ${w.rotulo}`).join(" ou ");
  function linkWhats(w, id) {
    const c = id && window.CAES[id];
    const msg = c
      ? `Oi, ${w.nome}! Vi a história do ${c.nome} no site e tenho interesse em adotar. Podemos conversar? 🐾`
      : `Oi, ${w.nome}! Vi o site do Arthur e do Zé e quero saber mais sobre a adoção 🐾`;
    return `https://wa.me/${w.numero}?text=${encodeURIComponent(msg)}`;
  }
  function botoesWhats(id) {
    return cfg.WHATSAPP.map((w) =>
      `<a class="btn btn-whats btn-pessoa" href="${linkWhats(w, id)}" target="_blank" rel="noopener"><span><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Falar com ${w.nome}</span><small>${w.rotulo}</small></a>`).join("");
  }

  function texto(id) {
    const c = window.CAES[id];
    return `Conhece o ${c.nome}? 🐾\n${c.gancho}\n\n` +
      `📍 ${cfg.CIDADE}\n` +
      `📖 A história dele: ${urlCompart(id)}\n` +
      `💬 Quer adotar? WhatsApp ${contato()}\n\n` +
      `Não pode adotar? Compartilhar já ajuda muito 💛`;
  }

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  function carregar(src) {
    return new Promise((ok, erro) => {
      const i = new Image();
      i.onload = () => ok(i); i.onerror = erro; i.src = src;
    });
  }

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
  }

  async function gerarCard(id, formato = "post") {
    const c = window.CAES[id];
    const cor = id === "ze" ? "#3A78B8" : "#D9702A";
    try { await Promise.all([document.fonts.load('80px "Patrick Hand"'), document.fonts.load('800 30px "Nunito"')]); } catch (e) {}
    const W = 1080, H = 1350;
    const story = formato === "story";
    const cv = document.createElement("canvas"); cv.width = W; cv.height = story ? 1920 : H;
    const ctx = cv.getContext("2d");

    // fundo creme com pontinhos
    ctx.fillStyle = "#FBF1E1"; ctx.fillRect(0, 0, W, cv.height);
    ctx.fillStyle = "rgba(58,38,24,.06)";
    for (let y = 10; y < cv.height; y += 26) for (let x = 10; x < W; x += 26) { ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill(); }
    if (story) {
      // formato stories/TikTok (9:16): faixa em cima e embaixo, card no meio
      ctx.textAlign = "center";
      rr(ctx, 140, 120, W - 280, 96, 48); ctx.fillStyle = cor; ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = '800 40px "Nunito", sans-serif';
      ctx.fillText("Me ajuda a achar um lar? 💛", W / 2, 182);
      ctx.fillStyle = "#3A2618"; ctx.font = '60px "Patrick Hand", cursive';
      ctx.fillText("Compartilhe! Pode ser o meu lar.", W / 2, 1760);
      ctx.translate(0, 270);
    }

    // título
    ctx.textAlign = "center"; ctx.fillStyle = "#3A2618";
    ctx.font = '84px "Patrick Hand", cursive';
    ctx.fillText("Me adota? 🐾", W / 2, 118);

    // polaroid com a foto
    const foto = await carregar((document.documentElement.dataset.base || "") + c.cardFoto);
    const pw = 600, ph = 760, px = 90, py = 170;
    ctx.save();
    ctx.translate(px + pw / 2, py + ph / 2); ctx.rotate(-0.04);
    ctx.shadowColor = "rgba(58,38,24,.25)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
    ctx.fillStyle = "#fff"; ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
    ctx.shadowColor = "transparent";
    const iw = pw - 36, ih = ph - 110;
    const esc = Math.max(iw / foto.width, ih / foto.height);
    const sw = iw / esc, sh = ih / esc;
    ctx.drawImage(foto, (foto.width - sw) / 2, (foto.height - sh) / 2, sw, sh, -pw / 2 + 18, -ph / 2 + 18, iw, ih);
    ctx.fillStyle = cor; ctx.font = '72px "Patrick Hand", cursive';
    ctx.fillText(c.nome, 0, ph / 2 - 26);
    ctx.restore();

    // infos à direita
    const infos = c.ficha.map(([k, v]) => [k, limpo(v)]).filter(([, v]) => v);
    let y = 230; const x = 730;
    ctx.textAlign = "left";
    ctx.fillStyle = cor; ctx.font = '800 30px "Nunito", sans-serif';
    wrap(ctx, c.descricao, x, y, 300, 36).forEach((l, i) => ctx.fillText(l, x, y + i * 36));
    y += 90;
    const tags = (c.jeito || []).map(limpo).filter(Boolean);
    ctx.font = '800 24px "Nunito", sans-serif';
    tags.forEach((t) => {
      const w = ctx.measureText(t).width + 32;
      rr(ctx, x, y - 30, w, 42, 21); ctx.fillStyle = cor; ctx.fill();
      ctx.fillStyle = "#fff"; ctx.fillText(t, x + 16, y);
      y += 54;
    });
    if (tags.length) y += 20;
    const infos2 = infos.filter(([k]) => ["Idade", "Porte", "Sexo"].includes(k));
    infos2.forEach(([k, v]) => {
      ctx.fillStyle = "#6B5444"; ctx.font = '700 22px "Nunito", sans-serif'; ctx.fillText(k.toUpperCase(), x, y);
      ctx.fillStyle = "#3A2618"; ctx.font = '800 28px "Nunito", sans-serif';
      const linhas = wrap(ctx, v, x, y, 300, 32);
      linhas.forEach((l, i) => ctx.fillText(l, x, y + 34 + i * 32));
      y += 34 + linhas.length * 32 + 22;
    });

    // rodapé
    rr(ctx, 60, 1000, W - 120, 290, 32); ctx.fillStyle = "#FFFBF4"; ctx.fill();
    ctx.textAlign = "center"; ctx.fillStyle = "#3A2618";
    ctx.font = '800 34px "Nunito", sans-serif';
    ctx.fillText(`Resgatado, procurando um lar em ${cfg.CIDADE}`, W / 2, 1062);
    ctx.fillStyle = "#1FA855"; ctx.font = '800 38px "Nunito", sans-serif';
    ctx.fillText(`WhatsApp ${cfg.WHATSAPP[0].nome} ${cfg.WHATSAPP[0].rotulo}`, W / 2, 1130);
    if (cfg.WHATSAPP[1]) { ctx.font = '800 30px "Nunito", sans-serif'; ctx.fillText(`${cfg.WHATSAPP[1].nome} ${cfg.WHATSAPP[1].rotulo}`, W / 2, 1172); }
    ctx.fillStyle = "#6B5444"; ctx.font = '700 28px "Nunito", sans-serif';
    ctx.fillText("Veja a história completa em", W / 2, 1222);
    ctx.fillStyle = cor; ctx.font = '800 32px "Nunito", sans-serif';
    ctx.fillText(urlDo(id).replace(/^https?:\/\//, ""), W / 2, 1262);

    return new Promise((ok) => cv.toBlob(ok, "image/jpeg", 0.9));
  }

  function wrap(ctx, t, x, y, max) {
    const palavras = t.split(" "); const linhas = []; let l = "";
    palavras.forEach((p) => {
      const teste = l ? l + " " + p : p;
      if (ctx.measureText(teste).width > max && l) { linhas.push(l); l = p; } else l = teste;
    });
    if (l) linhas.push(l);
    return linhas;
  }

  async function abrir(id) {
    const c = window.CAES[id];
    let modal = document.getElementById("modal-card");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modal-card"; modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-caixa" role="dialog" aria-modal="true" aria-labelledby="modal-tit">
          <h3 class="titulo-mao" id="modal-tit"></h3>
          <div class="formatos" role="tablist">
            <button class="formato ativo" data-formato="post">Post / WhatsApp</button>
            <button class="formato" data-formato="story">Stories / TikTok</button>
          </div>
          <img id="card-img" alt="Card de adoção">
          <p class="rede-titulo">Compartilhar em</p>
          <div class="redes">
            <a class="rede rede-whats" id="r-whats" target="_blank" rel="noopener"><span><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></span>WhatsApp</a>
            <button class="rede rede-insta" id="r-insta"><span><i class="fa-brands fa-instagram" aria-hidden="true"></i></span>Instagram</button>
            <a class="rede rede-face" id="r-face" target="_blank" rel="noopener"><span><i class="fa-brands fa-facebook-f" aria-hidden="true"></i></span>Facebook</a>
            <button class="rede rede-tiktok" id="r-tiktok"><span><i class="fa-brands fa-tiktok" aria-hidden="true"></i></span>TikTok</button>
          </div>
          <p class="nota-rede" id="nota-rede"></p>
          <textarea id="card-txt" aria-label="Texto para compartilhar"></textarea>
          <div class="acoes">
            <button class="btn btn-compartilhar" id="m-share"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i> Mais opções</button>
            <a class="btn btn-claro" id="m-baixar"><i class="fa-solid fa-download" aria-hidden="true"></i> Baixar imagem</a>
            <button class="btn btn-claro" id="m-copiar"><i class="fa-regular fa-copy" aria-hidden="true"></i> Copiar texto</button>
            <button class="btn btn-claro" id="m-fechar">Fechar</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
      modal.addEventListener("click", (e) => { if (e.target === modal) modal.hidden = true; });
      modal.querySelector("#m-fechar").onclick = () => (modal.hidden = true);
    }
    modal.hidden = false;
    modal.querySelector("#modal-tit").textContent = `Ajude o ${c.nome} a achar um lar`;
    const txtEl = modal.querySelector("#card-txt");
    txtEl.value = texto(id);
    const img = modal.querySelector("#card-img");
    const nota = modal.querySelector("#nota-rede");
    const atual = {};

    async function preparar(formato) {
      modal.querySelectorAll(".formato").forEach((b) => b.classList.toggle("ativo", b.dataset.formato === formato));
      img.removeAttribute("src");
      const blob = await gerarCard(id, formato);
      if (atual.url) URL.revokeObjectURL(atual.url);
      atual.url = URL.createObjectURL(blob);
      atual.arquivo = new File([blob], `adote-${id}${formato === "story" ? "-stories" : ""}.jpg`, { type: "image/jpeg" });
      img.src = atual.url;
      const baixar = modal.querySelector("#m-baixar");
      baixar.href = atual.url; baixar.download = atual.arquivo.name;
    }
    modal.querySelectorAll(".formato").forEach((b) => (b.onclick = () => preparar(b.dataset.formato)));

    const atualizarLinks = () => {
      modal.querySelector("#r-whats").href = `https://wa.me/?text=${encodeURIComponent(comOrigem(txtEl.value, "whatsapp"))}`;
      modal.querySelector("#r-face").href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlCompart(id, "facebook"))}`;
    };
    atualizarLinks(); txtEl.oninput = atualizarLinks;
    modal.querySelector("#r-face").addEventListener("click", () => copiar(txtEl.value).then(() => toast("Texto copiado: cole na legenda do Facebook")));

    // Instagram e TikTok não têm link de compartilhamento pela web:
    // no celular abrimos o menu do sistema com a imagem (o app aparece lá);
    // no computador baixamos a imagem e copiamos a legenda.
    async function viaApp(nomeApp) {
      if (!atual.arquivo || !atual.arquivo.name.includes("stories")) await preparar("story");
      await copiar(txtEl.value);
      if (navigator.canShare && navigator.canShare({ files: [atual.arquivo] })) {
        nota.textContent = `Legenda copiada! Escolha o ${nomeApp} na lista e cole o texto.`;
        try { await navigator.share({ files: [atual.arquivo] }); } catch (e) {}
      } else {
        const a = document.createElement("a"); a.href = atual.url; a.download = atual.arquivo.name; a.click();
        nota.textContent = `Imagem baixada e legenda copiada. Abra o ${nomeApp}, poste a imagem e cole o texto.`;
      }
    }
    modal.querySelector("#r-insta").onclick = () => viaApp("Instagram");
    modal.querySelector("#r-tiktok").onclick = () => viaApp("TikTok");

    modal.querySelector("#m-share").onclick = async () => {
      const dados = { files: [atual.arquivo], text: txtEl.value, title: `Adote o ${c.nome}` };
      try {
        if (navigator.canShare && navigator.canShare({ files: [atual.arquivo] })) await navigator.share(dados);
        else if (navigator.share) await navigator.share({ text: txtEl.value, title: dados.title });
        else { await copiar(txtEl.value); toast("Texto copiado! Baixe a imagem e cole o texto junto."); }
      } catch (e) { /* usuário cancelou */ }
    };
    modal.querySelector("#m-copiar").onclick = async () => { await copiar(txtEl.value); toast("Texto copiado!"); };
    nota.textContent = "";
    await preparar("post");
  }

  async function copiar(t) {
    try { await navigator.clipboard.writeText(t); } catch (e) {
      const a = document.createElement("textarea"); a.value = t; document.body.appendChild(a); a.select(); document.execCommand("copy"); a.remove();
    }
  }

  async function gerarCardSite() {
    try { await Promise.all([document.fonts.load('80px "Patrick Hand"'), document.fonts.load('800 30px "Nunito"')]); } catch (e) {}
    const W = 1080, H = 1920;
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    ctx.fillStyle = "#FBF1E1"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(58,38,24,.06)";
    for (let y = 10; y < H; y += 26) for (let x = 10; x < W; x += 26) { ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill(); }
    ctx.textAlign = "center"; ctx.fillStyle = "#3A2618";
    ctx.font = '110px "Patrick Hand", cursive';
    ctx.fillText("Arthur e Zé", W / 2, 300);
    ctx.font = '70px "Patrick Hand", cursive';
    ctx.fillText("procuram um lar 🐾", W / 2, 400);
    const [a, z] = await Promise.all([carregar((document.documentElement.dataset.base || "") + "assets/figurinhas/arthur-sentado.webp"), carregar((document.documentElement.dataset.base || "") + "assets/figurinhas/ze-sentado.webp")]);
    const ha = 640, hz = 670;
    const wa = a.width * ha / a.height, wz = z.width * hz / z.height;
    const gap = (W - wa - wz) / 3;
    ctx.drawImage(a, gap, 1380 - ha, wa, ha);
    ctx.drawImage(z, gap * 2 + wa - 20, 1380 - hz, wz, hz);
    ctx.font = '800 40px "Nunito", sans-serif';
    ctx.fillText("Dois resgatados, duas histórias.", W / 2, 1460);
    ctx.fillText(`Estão em ${cfg.CIDADE}.`, W / 2, 1515);
    rr(ctx, 120, 1600, W - 240, 150, 40); ctx.fillStyle = "#FFFBF4"; ctx.fill();
    ctx.fillStyle = "#6B5444"; ctx.font = '700 32px "Nunito", sans-serif';
    ctx.fillText("Conheça a história deles em", W / 2, 1660);
    ctx.fillStyle = "#D9702A"; ctx.font = '800 42px "Nunito", sans-serif';
    ctx.fillText(urlDo("").replace(/^https?:\/\//, "").replace(/\/$/, ""), W / 2, 1715);
    return new Promise((ok) => cv.toBlob(ok, "image/jpeg", 0.9));
  }

  const textoSite = () => `Conhece o Arthur e o Zé? 🐾\nDois cachorros resgatados procurando uma família em ${cfg.CIDADE}.\n\n📖 Veja a história deles: ${urlCompart("")}\n\nNão pode adotar? Compartilhar já ajuda muito 💛`;

  async function compartilharSiteEm(rede, nota) {
    const t = textoSite();
    if (rede === "whats") return window.open(`https://wa.me/?text=${encodeURIComponent(comOrigem(t, "whatsapp"))}`, "_blank");
    if (rede === "face") { await copiar(t); toast("Texto copiado: cole na legenda"); return window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlCompart("", "facebook"))}`, "_blank"); }
    const nomeApp = rede === "insta" ? "Instagram" : "TikTok";
    const blob = await gerarCardSite();
    const arquivo = new File([blob], "arthur-e-ze-stories.jpg", { type: "image/jpeg" });
    await copiar(t);
    if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
      toast(`Legenda copiada! Escolha o ${nomeApp}.`);
      try { await navigator.share({ files: [arquivo] }); } catch (e) {}
    } else {
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = arquivo.name; a.click();
      if (nota) nota.textContent = `Imagem baixada e legenda copiada. Abra o ${nomeApp}, poste a imagem e cole o texto.`;
    }
  }

  async function compartilharSite() {
    const t = `Conheça o Arthur e o Zé, dois cachorros resgatados procurando uma família em ${cfg.CIDADE} 🐾\n${urlDo("")}`;
    try {
      if (navigator.share) await navigator.share({ text: t, title: "Arthur e Zé procuram um lar" });
      else { await copiar(t); toast("Link copiado!"); }
    } catch (e) {}
  }

  return { abrir, texto, compartilharSite, compartilharSiteEm, gerarCard, gerarCardSite, linkWhats, botoesWhats };
})();
