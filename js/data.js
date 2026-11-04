/* ==========================================================
   CONTENU DU SITE – c'est ici que tu modifies textes et projets.
   Chaque texte existe en français (fr) et en anglais (en).
   Les mots entourés de <b>…</b> sont affichés en violet gras (comme dans le CV).
   Les médias (images, vidéos) sont à déposer dans /media puis à référencer ici :
     cover   : image de la vignette (accueil)            ex. "media/castor/cover.jpg"
     preview : vidéo qui se lance au survol (accueil)    ex. "media/castor/preview.mp4"
     logo    : logo du jeu (bandeau)                     ex. "media/castor/logo.png"
     map     : illustration de la map (bandeau)          ex. "media/castor/map.jpg"
   Tant qu'un média vaut null, un emplacement « à compléter » s'affiche.
   ========================================================== */

window.PORTFOLIO = {
  site: {
    name: "RIMET TAO",
    role: { fr: "Junior Level Designer", en: "Junior Level Designer" },
    traits: {
      fr: "Calme - Méticuleux - Pragmatique - Honnête - Ponctuel",
      en: "Calm - Meticulous - Pragmatic - Honest - Punctual"
    },
    introVideo: "media/intro.mp4", // vidéo d'accueil (optionnelle)
    contact: {
      phone: "+33681287945",
      email: "taorimet@gmail.com",
      linkedin: "https://www.linkedin.com/in/tao-rimet-256a21330",
      cvColor: "assets/CV_Rimet_Tao_Couleur.pdf",
      cvPrint: "assets/CV_Rimet_Tao_Imprimable.pdf"
    }
  },

  /* Onglets du bandeau supérieur */
  tabs: [
    { id: "home", route: "#/home", label: { fr: "Accueil", en: "Home" } },
    { id: "professional", route: "#/professional", label: { fr: "Projet Professionnel", en: "Professional Project" } },
    { id: "personal", route: "#/personal", label: { fr: "Projet Personnel", en: "Personal Project" } },
    { id: "exercise", route: "#/exercise", label: { fr: "Exercice", en: "Exercise" } },
    { id: "infos", route: "#/infos", label: { fr: "Infos", en: "Infos" } }
  ],

  /* Projets (données issues du CV : durées, équipes, moteurs, missions) */
  projects: [
    {
      id: "castor-ecureuil",
      category: "professional",
      title: "Castor et l'Écureuil",
      genre: { fr: "Plateformer narratif", en: "Narrative Platformer" },
      type: { fr: "Level Design", en: "Level Design" },
      duration: { fr: "Juin – 4 semaines", en: "June – 4 weeks" },
      engine: "Unreal Engine",
      engineIcon: "unreal",
      team: 14,
      cover: null, preview: null, logo: null, map: null,
      context: {
        fr: "Plateformer narratif sous Unreal Engine, équipe de 14 personnes.",
        en: "Narrative platformer on Unreal Engine, team of 14 people."
      },
      roles: [
        { fr: "<b>Intentions</b> et <b>conception</b> du niveau", en: "Level <b>intentions</b> and <b>conception</b>" },
        { fr: "<b>Création</b> et <b>formalisation</b> du <b>Level Design Document</b>", en: "<b>Creation</b> and <b>formalization</b> of the <b>Level Design Document</b>" },
        { fr: "En charge du <b>blocking</b> et de ses <b>modifications</b> après plusieurs sessions de QA", en: "In charge of the <b>blocking</b> and <b>modifications</b> after various QA sessions" },
        { fr: "<b>Conception</b> de <b>cinématiques</b> in game et out game", en: "<b>Conception</b> of <b>cinematics</b> in game and out game" },
        { fr: "Formalisation du <b>Game Design Document</b>", en: "<b>Game Design Document</b> formalisation" }
      ],
      sections: [
        { title: { fr: "Vue d'ensemble", en: "Overview" } },
        { title: { fr: "Approche du Level Design", en: "Level Design Approach" } },
        { title: { fr: "Blocking", en: "Blocking" } },
        { title: { fr: "Sessions de QA", en: "QA Sessions" } },
        { title: { fr: "Ce que j'ai appris", en: "What I learned" } }
      ],
      links: []
    },
    {
      id: "fury-rogue",
      category: "professional",
      title: "MadMax: Fury Rogue",
      genre: { fr: "Rogue", en: "Rogue" },
      type: { fr: "Level Design", en: "Level Design" },
      duration: { fr: "Février – 3 semaines", en: "February – 3 weeks" },
      engine: "Unity",
      engineIcon: "unity",
      team: 15,
      cover: null, preview: null, logo: null, map: null,
      context: {
        fr: "Rogue sous Unity, équipe de 15 personnes.",
        en: "Rogue on Unity, team of 15 people."
      },
      roles: [
        { fr: "<b>Intentions</b> et <b>conception</b> du niveau avec un autre Level Designer", en: "Level <b>intentions</b> and <b>conception</b> with another Level Designer" },
        { fr: "En charge du <b>blocking</b>", en: "In charge of the <b>blocking</b>" },
        { fr: "<b>Création</b> et <b>formalisation</b> du <b>Level Design Document</b>", en: "<b>Creation</b> and <b>formalisation</b> of the <b>Level Design Document</b>" }
      ],
      sections: [
        { title: { fr: "Vue d'ensemble", en: "Overview" } },
        { title: { fr: "Approche du Level Design", en: "Level Design Approach" } },
        { title: { fr: "Blocking", en: "Blocking" } },
        { title: { fr: "Ce que j'ai appris", en: "What I learned" } }
      ],
      links: []
    },
    {
      id: "hellstorm",
      category: "professional",
      title: "HellStorm",
      genre: { fr: "Arcade Racer", en: "Arcade Racer" },
      type: { fr: "Lead Game Designer – Level Design", en: "Lead Game Designer – Level Design" },
      duration: { fr: "Novembre – 3 semaines", en: "November – 3 weeks" },
      engine: "Unreal Engine",
      engineIcon: "unreal",
      team: 14,
      cover: null, preview: null, logo: null, map: null,
      context: {
        fr: "Arcade racer sous Unreal Engine, équipe de 14 personnes.",
        en: "Arcade racer on Unreal Engine, team of 14 people."
      },
      roles: [
        { fr: "<b>Intentions</b> et <b>conception</b> du niveau", en: "Level <b>intentions</b> and <b>conception</b>" },
        { fr: "En charge du <b>blocking</b>", en: "In charge of the <b>blocking</b>" },
        { fr: "<b>Création</b> et <b>formalisation</b> du <b>Level Design Document</b>", en: "<b>Creation</b> and <b>formalisation</b> of the <b>Level Design Document</b>" }
      ],
      sections: [
        { title: { fr: "Vue d'ensemble", en: "Overview" } },
        { title: { fr: "Approche du Level Design", en: "Level Design Approach" } },
        { title: { fr: "Blocking", en: "Blocking" } },
        { title: { fr: "Ce que j'ai appris", en: "What I learned" } }
      ],
      links: []
    },
    {
      id: "cs2-map",
      category: "personal",
      title: "Counter-Strike 2 Map",
      genre: { fr: "FPS compétitif", en: "Competitive FPS" },
      type: { fr: "Map multijoueur (Deathmatch)", en: "Multiplayer map (Deathmatch)" },
      duration: { fr: "À compléter", en: "To be completed" },
      engine: "Hammer Tools (Valve)",
      engineIcon: "hammer",
      team: 1,
      cover: null, preview: null, logo: null, map: null,
      context: {
        fr: "Map Counter-Strike 2 réalisée seul avec Hammer Tools, l'éditeur de niveaux de Valve.",
        en: "Counter-Strike 2 map made solo with Hammer Tools, Valve's level editor."
      },
      roles: [],
      sections: [
        { title: { fr: "Vue d'ensemble", en: "Overview" } },
        { title: { fr: "Intentions et flow", en: "Intentions and flow" } },
        { title: { fr: "Ce que j'ai appris", en: "What I learned" } }
      ],
      links: []
    },
    {
      id: "cs2-map-wip",
      category: "personal",
      wip: true,        // vignette non cliquable avec le bandeau « WIP »
      title: "Counter-Strike 2 Map",
      genre: { fr: "FPS compétitif", en: "Competitive FPS" },
      type: { fr: "Map multijoueur", en: "Multiplayer map" },
      duration: { fr: "En cours", en: "In progress" },
      engine: "Hammer Tools (Valve)",
      engineIcon: "hammer",
      team: 1,
      cover: null, preview: null, logo: null, map: null,
      context: { fr: "Map Counter-Strike 2 en cours de réalisation.", en: "Counter-Strike 2 map in progress." },
      roles: [], sections: [], links: []
    },
    {
      id: "gamejam-fast-fps",
      category: "personal",
      title: "Game Jam",
      genre: { fr: "Fast FPS", en: "Fast FPS" },
      type: { fr: "Level Design – Game Jam", en: "Level Design – Game Jam" },
      duration: { fr: "À compléter", en: "To be completed" },
      engine: "Unity",
      engineIcon: "unity",
      team: 11,
      cover: null, preview: null, logo: null, map: null,
      context: { fr: "Fast FPS réalisé en Game Jam sous Unity.", en: "Fast FPS made during a Game Jam on Unity." },
      roles: [],
      sections: [
        { title: { fr: "Vue d'ensemble", en: "Overview" } },
        { title: { fr: "Intentions et flow", en: "Intentions and flow" } },
        { title: { fr: "Ce que j'ai appris", en: "What I learned" } }
      ],
      links: []
    },
    {
      id: "gamejam-beat-em-up",
      category: "personal",
      title: "Game Jam",
      genre: { fr: "Beat'em Up", en: "Beat'em Up" },
      type: { fr: "Level Design – Game Jam", en: "Level Design – Game Jam" },
      duration: { fr: "À compléter", en: "To be completed" },
      engine: "Unity",
      engineIcon: "unity",
      team: 8,
      cover: null, preview: null, logo: null, map: null,
      context: { fr: "Beat'em Up réalisé en Game Jam sous Unity.", en: "Beat'em Up made during a Game Jam on Unity." },
      roles: [],
      sections: [
        { title: { fr: "Vue d'ensemble", en: "Overview" } },
        { title: { fr: "Intentions et flow", en: "Intentions and flow" } },
        { title: { fr: "Ce que j'ai appris", en: "What I learned" } }
      ],
      links: []
    },
    {
      id: "indiana-jones",
      category: "exercise",
      title: "Exercice Indiana Jones",
      genre: { fr: "À compléter", en: "To be completed" },
      type: { fr: "Exercice de Level Design", en: "Level Design exercise" },
      duration: { fr: "À compléter", en: "To be completed" },
      engine: "",
      engineIcon: null,
      team: null,
      cover: null, preview: null, logo: null, map: null,
      context: { fr: "Exercice de Level Design.", en: "Level Design exercise." },
      roles: [],
      sections: [
        { title: { fr: "Consigne", en: "Brief" } },
        { title: { fr: "Résultat", en: "Result" } }
      ],
      links: []
    },
    {
      id: "exercice-control",
      category: "exercise",
      title: "Exercice Control",
      genre: { fr: "À compléter", en: "To be completed" },
      type: { fr: "Exercice de Level Design", en: "Level Design exercise" },
      duration: { fr: "À compléter", en: "To be completed" },
      engine: "",
      engineIcon: null,
      team: null,
      cover: null, preview: null, logo: null, map: null,
      context: { fr: "Exercice de Level Design.", en: "Level Design exercise." },
      roles: [],
      sections: [
        { title: { fr: "Consigne", en: "Brief" } },
        { title: { fr: "Résultat", en: "Result" } }
      ],
      links: []
    },
    {
      id: "exercice-thief",
      category: "exercise",
      title: "Exercice Thief",
      genre: { fr: "À compléter", en: "To be completed" },
      type: { fr: "Exercice de Level Design", en: "Level Design exercise" },
      duration: { fr: "À compléter", en: "To be completed" },
      engine: "",
      engineIcon: null,
      team: null,
      cover: null, preview: null, logo: null, map: null,
      context: { fr: "Exercice de Level Design.", en: "Level Design exercise." },
      roles: [],
      sections: [
        { title: { fr: "Consigne", en: "Brief" } },
        { title: { fr: "Résultat", en: "Result" } }
      ],
      links: []
    }
  ],

  /* Page Infos (compétences, langues, loisirs : repris du CV) */
  about: {
    text: {
      fr: [
        "Junior Level Designer en formation de concepteur de jeux vidéo / Game Designer à <b>GameSup</b> (Lyon, 2023-2027).",
        "Je m'occupe des <b>intentions</b> de niveau, du <b>layout</b> et du <b>blocking</b>, puis je formalise le tout dans des <b>Level Design Documents</b>. J'organise aussi des sessions de <b>QA</b> pour recueillir des retours et faire évoluer mes niveaux."
      ],
      en: [
        "Junior Level Designer, training as a video game designer / Game Designer at <b>GameSup</b> (Lyon, 2023-2027).",
        "I work on level <b>intentions</b>, <b>layout</b> and <b>blocking</b>, then formalise everything in <b>Level Design Documents</b>. I also organise <b>QA</b> sessions to gather feedback and iterate on my levels."
      ]
    },
    skills: [
      {
        title: { fr: "Level Design", en: "Level Design" },
        items: ["Layout", "Blocking", { fr: "Documentation", en: "Documentation" }, { fr: "Cinématiques", en: "Cinematics" }, { fr: "Modélisation 3D", en: "3D Modeling" }],
        tools: [["affinity", "Affinity"], ["unreal", "Unreal"], ["unity", "Unity"], ["maya", "Maya"]]
      },
      {
        title: { fr: "Game Design", en: "Game Design" },
        items: [{ fr: "Documentation", en: "Documentation" }, "Mockup", "Personas", { fr: "Théories du joueur", en: "Player Theories" }],
        tools: [["photoshop", "Photoshop"], ["figma", "Figma"], ["krita", "Krita"]]
      },
      {
        title: { fr: "QA", en: "QA" },
        items: [{ fr: "Documentation de test", en: "Test documentation" }, { fr: "Organisation de sessions", en: "Session organization" }, { fr: "Recueil de retours", en: "Gathering feedback" }],
        tools: [["office", "Office"]]
      }
    ],
    languages: [
      { fr: "Français – Natif", en: "French – Native" },
      { fr: "Anglais – C1 / Pro", en: "English – C1 / Pro" },
      { fr: "Espagnol – A2", en: "Spanish – A2" }
    ],
    education: {
      fr: "Certification professionnelle concepteur de jeux vidéo / Game Designer – <b>GameSup : 2023-2027</b>",
      en: "Professional certification in video game design / Game Designer – <b>GameSup: 2023-2027</b>"
    },
    hobbies: [
      { icon: "boxing", name: { fr: "Boxe", en: "Boxing" }, level: { fr: "Intermédiaire", en: "Intermediate" }, freq: { fr: "3 fois par semaine", en: "3 times a week" }, years: { fr: "2 ans", en: "2 years" } },
      { icon: "cooking", name: { fr: "Cuisine", en: "Fine cooking" }, level: { fr: "Intermédiaire", en: "Intermediate" }, freq: { fr: "2 fois par semaine", en: "2 times a week" }, years: { fr: "6 ans", en: "6 years" } },
      { icon: "motorcycle", name: { fr: "Moto", en: "Motorcycle" }, level: { fr: "Expert", en: "Expert" }, freq: { fr: "1 fois par semaine", en: "1 time a week" }, years: { fr: "5 ans", en: "5 years" } }
    ]
  },

  /* Textes de l'interface */
  ui: {
    projects: { fr: "Projets", en: "Projects" },
    professional: { fr: "Projets professionnels", en: "Professional Projects" },
    personal: { fr: "Projets personnels", en: "Personal Projects" },
    exercise: { fr: "Exercices", en: "Exercises" },
    infos: { fr: "Infos", en: "Infos" },
    aboutMe: { fr: "À propos", en: "About me" },
    skills: { fr: "Compétences", en: "Skills" },
    languages: { fr: "Langues", en: "Languages" },
    education: { fr: "Formation", en: "Education" },
    hobbies: { fr: "Loisirs", en: "Hobbies" },
    contact: { fr: "Contact", en: "Contact" },
    back: { fr: "← Retour", en: "← Back" },
    myRoles: { fr: "Mes missions", en: "My Roles" },
    team: { fr: "Équipe", en: "Team" },
    people: { fr: "personne(s) sur le projet", en: "people on the project" },
    video: { fr: "Vidéo", en: "Video" },
    todo: { fr: "Texte à compléter.", en: "Text to be completed." },
    emptyCategory: { fr: "Aucun projet dans cette catégorie pour le moment.", en: "No project in this category yet." },
    mediaTodo: { fr: "Média à ajouter", en: "Media to be added" },
    introTodo: { fr: "Vidéo d'accueil à ajouter", en: "Intro video to be added" },
    coverTodo: { fr: "Vignette à ajouter", en: "Cover to be added" },
    banner: { genre: { fr: "Genre", en: "Genre" }, logo: { fr: "Logo du jeu", en: "Game logo" }, map: { fr: "Illustration de la map", en: "Map illustration" } },
    cvLabel: { fr: "Télécharger mon CV", en: "Download my CV" },
    cvColor: { fr: "CV - Version Couleur", en: "CV - Color Version" },
    cvPrint: { fr: "CV - Version Imprimable", en: "CV - Printable Version" },
    copied: { fr: "Numéro copié !", en: "Number copied!" },
    wipTitle: { fr: "Projet en cours : bientôt disponible", en: "Work in progress: coming soon" },
    linkedin: { fr: "LinkedIn", en: "LinkedIn" },
    menu: { fr: "Menu", en: "Menu" },
    notFound: { fr: "Page introuvable.", en: "Page not found." },
    pageTitle: { fr: "Rimet Tao – Portfolio Level Design", en: "Rimet Tao – Level Design Portfolio" }
  }
};
