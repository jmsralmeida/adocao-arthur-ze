/*
 * Tudo que é conteúdo fica aqui: textos, fotos, ficha e contatos.
 * Trechos entre ⟦ ⟧ são PENDÊNCIAS: aparecem destacados em amarelo no site
 * enquanto MOSTRAR_PENDENTES = true. Troque pelo texto real antes de publicar.
 */
window.CONFIG = {
  // Endereço final do site (GitHub Pages) (usado no texto de compartilhar e no card).
  SITE_URL: "https://jmsralmeida.github.io/adocao-arthur-ze",
  CIDADE: "Suzano - SP", // tirado do cartaz que você já usa
  WHATSAPP: [
    // tirados do cartaz que você já usa; confirmar nomes e se ambos continuam valendo
    { nome: "James", numero: "5511972237267", rotulo: "(11) 97223-7267" },
    { nome: "Leniza", numero: "5511942765411", rotulo: "(11) 94276-5411" },
  ],
  INSTAGRAM: "", // ex.: "adoteartherze" (sem @). Vazio = botão some.
  // Google Analytics 4: cole aqui o ID de medição (ex.: "G-AB12CD34EF"). Vazio = sem analytics.
  GA_ID: "G-48GWH148WF",
  MOSTRAR_PENDENTES: true, // false esconde as linhas da ficha ainda não preenchidas
};

window.CAES = {
  arthur: {
    nome: "Arthur",
    cor: "arthur",
    descricao: "o caramelo com preto",
    gancho: "Sobreviveu à rua, foi tratado e agora só quer uma família pra passear junto.",
    capa: "assets/fotos/arthur-shopping.webp",
    cardFoto: "assets/fotos/arthur-sorriso.webp",
    // Características em destaque (viram "etiquetas" na ficha e no card de compartilhar)
    jeito: ["Extremamente dócil", "Carinhoso", "Muita energia", "Ama passear", "Dócil com crianças", "Amigo de gatos e cães"],
    ficha: [
      ["Sexo", "Macho"],
      ["Idade", "Cerca de 2 anos"],
      ["Porte", "Médio"],
      ["Castrado", "Sim ✓"],
      ["Vermifugado", "Sim, e sem parasitas ✓"],
      ["Exames", "Laboratoriais sem alterações ✓"],
      ["Vacinas", "Ainda não vacinado"],
      ["Convive com", "Crianças, gatos e outros cães ✓"],
      ["Já sabe", "Andar de carro e passear em shopping e parques ✓"],
      ["Ambiente ideal", "Com espaço e alguém que passeie com ele. Preso e sozinho por muito tempo, ele fica triste."],
    ],
    passos: [
      {
        titulo: "Oi, eu sou o Arthur!",
        texto: "Caramelo com preto, uns 2 anos e muito amor pra dar. Vem ver como eu cheguei até aqui.",
        ilustra: "assets/ilustra/oi.webp",
        fotos: ["assets/fotos/arthur-shopping.webp"],
      },
      {
        titulo: "Deixado pra trás",
        texto: "Me abandonaram dizendo que eu era agressivo. Eu só precisava de alguém.",
        fotos: ["assets/fotos/arthur-olhar.webp"],
      },
      {
        titulo: "O cão do bairro",
        texto: "Os vizinhos cuidavam de mim e eu virei cão comunitário. Mas a rua é fria, incerta e perigosa.",
        fotos: ["assets/fotos/arthur-casinha.webp"],
      },
      {
        titulo: "O dia mais difícil",
        texto: "Ainda sem castrar, saí atrás das cachorras e sumi por dias. Foi aí que outros cachorros me atacaram.",
        fotos: ["assets/fotos/arthur-tratamento.webp"],
      },
      {
        titulo: "Voltei com as últimas forças",
        texto: "Quase sem vida, voltei pra perto de quem gostava de mim. E foi ali que meus tios me encontraram.",
        fotos: ["assets/fotos/arthur-curativo.webp"],
      },
      {
        titulo: "Cuidado e recomeço",
        texto: "Veterinário, curativos, castração e exames sem alterações. Padrão FIFA de vira-lata caramelo!",
        ilustra: "assets/ilustra/arthur-lenco.webp",
        fotos: ["assets/fotos/arthur-lenco.webp", "assets/fotos/arthur-lenco2.webp"],
      },
      {
        titulo: "Minha nova vida",
        texto: "Hoje divido a caminha com o Zé e a gatinha Mia. E me dou bem até com crianças.",
        ilustra: "assets/ilustra/sonhadores.webp",
        fotos: ["assets/fotos/arthur-gatinho.webp", "assets/fotos/trio-cama2.webp"],
      },
      {
        titulo: "Energia de sobra",
        texto: "Sou dócil e carinhoso, mas cheio de energia. Passear é a melhor parte do meu dia!",
        ilustra: "assets/ilustra/passeio.webp",
        video: "assets/videos/passeio.mp4",
        poster: "assets/videos/passeio.jpg",
      },
      {
        titulo: "Procuro meu lar de verdade",
        texto: "Aqui é só temporário. Quero uma família com espaço ou tempo pra passear comigo, porque sozinho eu fico triste.",
        fotos: ["assets/fotos/arthur-sorriso.webp", "assets/fotos/arthur-noel.webp"],
      },
    ],
  },

  ze: {
    nome: "Zé",
    cor: "ze",
    descricao: "o tigradinho",
    gancho: "Foi abandonado, escolheu os próprios resgatadores e agora procura um lar pra sempre.",
    capa: "assets/fotos/ze-colo.webp",
    cardFoto: "assets/fotos/ze-banco.webp",
    jeito: ["Extremamente dócil", "Carinhoso", "Cão de companhia", "Passeia até sem guia", "Amigo de gatos e cães"],
    ficha: [
      ["Sexo", "Macho"],
      ["Raça", "Sem raça definida"],
      ["Porte", "Médio"],
      ["Pelagem", "Tigrada (rajada)"],
      ["Idade", "Cerca de 4 anos"],
      ["Castrado", "Ainda não: castração marcada para 28/11"],
      ["Vacinas", "Ainda não vacinado"],
      ["Convive com", "Gatos e outros cães, sem nenhum problema ✓"],
      ["Jeito", "Cão de companhia: fica sempre pertinho e passeia até sem guia"],
      ["Já sabe", "Andar de carro e passear em shopping e parques ✓"],
      ["Ambiente ideal", "Com espaço e companhia. Preso e sozinho por muito tempo, ele pode não se adaptar."],
    ],
    passos: [
      {
        titulo: "Oi, eu sou o Zé!",
        texto: "Tigradinho, porte médio e companheiro de todas as horas. Minha história começa com um passeio de carro...",
        ilustra: "assets/ilustra/oi.webp",
        fotos: ["assets/fotos/ze-colo.webp"],
      },
      {
        titulo: "Um passeio sem volta",
        texto: "Tudo indica que me levaram pra dar uma volta de carro e me soltaram na rua. Sozinho.",
        fotos: ["assets/fotos/ze-rua.webp"],
      },
      {
        titulo: "Aquele casal era diferente",
        texto: "Vi um casal passeando com um cachorro todo enfaixado e pensei: esses são do bem. Cheguei perto e ganhei carinho na hora.",
        video: "assets/videos/passeio.mp4",
        poster: "assets/videos/passeio.jpg",
      },
      {
        titulo: "Eu escolhi eles",
        texto: "Me deram ração e tentaram me arrumar um lar com os vizinhos, kkk. Mas eu já tinha escolhido: segui os dois até em casa.",
        fotos: ["assets/fotos/ze-pe.webp", "assets/fotos/ze-casa.webp"],
      },
      {
        titulo: "A noite em que eu invadi",
        texto: "Ganhei casinha, comida e água fresca. Mas quando fecharam a porta, bateu o medo. Eu precisava de colo, então dei meu jeitinho e entrei.",
        ilustra: "assets/ilustra/ze-travesso.webp",
        fotos: ["assets/fotos/ze-colo2.webp", "assets/fotos/ze-carinho.webp"],
      },
      {
        titulo: "Um lar temporário",
        texto: "O apartamento é pequeno, mas eles reorganizaram tudo pra me abrigar. Lá mora a gatinha Mia, minha parceira.",
        ilustra: "assets/ilustra/amigo.webp",
        video: "assets/videos/trio-gatinho.mp4",
        poster: "assets/videos/trio-gatinho.jpg",
      },
      {
        titulo: "Do caos ao passeio",
        texto: "Meu primeiro passeio no carro deles foi um caos, rs. Hoje tiro de letra e fui até tirar foto com o Papai Noel. No passeio nem preciso de guia: vou sempre do lado de quem eu amo.",
        ilustra: "assets/ilustra/explorador.webp",
        fotos: ["assets/fotos/ze-noel.webp", "assets/fotos/ze-banco.webp"],
      },
      {
        titulo: "Procuro meu lar de verdade",
        texto: "Aqui é só temporário. Sou apegado e choro quando fico sozinho. Quero uma família que fique comigo, pra sempre.",
        fotos: ["assets/fotos/ze-banco2.webp", "assets/fotos/ze-shopping.webp"],
      },
    ],
  },
};
