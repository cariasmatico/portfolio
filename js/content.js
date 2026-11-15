/* =========================================================================
   SITE CONTENT
   -------------------------------------------------------------------------
   This is the only file you need to edit to change what the site says.

   - Text fields accept simple HTML: <em>italic</em>, <a href="...">link</a>, <br>.
   - Put files in /media and point to them like "media/works/zoom/01.jpg".
   - Leave a src or id empty ("") to show a grey placeholder.
   ========================================================================= */

window.SITE = {

  /* ---------- Identity ---------- */
  name: "Luciano Correa B.",
  tagline: "Composer, sound artist and multimedia artist working across concert music, electronics, stage performance and interactive media.",
  location: "Hamburg, Germany · Santiago, Chile",

  /* Shown in the footer and on the Contact page */
  contact: {
    email: "lucianocorreab@gmail.com",
    note: "For scores, recordings, collaborations and performance enquiries, write to me directly.",
    links: [
      { label: "YouTube",   url: "https://www.youtube.com/@LucianoAltair" },
      { label: "Instagram", url: "https://www.instagram.com/lu.altair/" },
      { label: "Spotify (Luciano Altair)", url: "https://open.spotify.com/artist/5zYGj1hsIxc6gjoLLTs9IQ" }
    ],
    publisher: ""
  },

  /* ---------- Agenda ----------
     Every event you add stays here. Future ones also appear on the landing
     page; once the date has passed they move to "Past" on the Agenda page.
     { date: "2027-01-24", title: "Title", text: "what — venue, city", url: "https://…" }
       date   "YYYY-MM-DD", or "YYYY-MM" / "YYYY" when you only know the month or year
       title  shown in italics; becomes a link when url is filled
       text   the rest of the line (optional)
       url    optional. An external page ("https://…") opens in a new tab;
              one of your works ("#aparicion") opens its page.
     Order doesn't matter: the site sorts by date. */
  agenda: [
    { date: "2027-01-08", title: "SANGRE", text: "multimedia performance — Forum HfMT, Hamburg", url: "" },

    /* past */
    { date: "2026-07", title: "ANIMACIÓN", text: "Multimedia Composition concert — HfMT Hamburg", url: "#animacion" },
    { date: "2026-06", title: "APARICIÓN", text: "Stimme X Festival — Hamburg", url: "#aparicion" },
    { date: "2026-06", title: "APARICIÓN", text: "Blurred Edges Festival — Hamburg", url: "#aparicion" },
    { date: "2026-02", title: "APARICIÓN", text: "Multimedia Composition concert — HfMT Hamburg", url: "#aparicion" },
    { date: "2025", title: "Polifonía 1", text: "“Intrafonías”, Anilla MAC — Museum of Contemporary Art, Santiago", url: "#polifonia-1" },
    { date: "2024", title: "Evaristo", text: "Antofagasta Symphony Orchestra — Antofagasta", url: "#evaristo" },
    { date: "2023", title: "Dispositivo 1: Asiento por favor", text: "“Efímera_”, Anilla MAC — Museum of Contemporary Art, Santiago", url: "#dispositivo-1" },
    { date: "2021", title: "Hilos", text: "XXX Festival de Música Contemporánea UC — Santiago", url: "#hilos" },
    { date: "2021", title: "Ejercicios de respiración", text: "Festival MusicAhora — La Serena", url: "#ejercicios-de-respiracion" }
  ],

  /* ---------- Works ----------
     categories: the filter buttons on the Works page.
     "Collaborations" is added automatically after them.

     Each work:
       slug           unique id used in the address (letters, numbers, hyphens)
       title          shown in italics
       year
       tags           any of the categories, e.g. ["Multimedia", "Performance"]
       collaboration  true = work for other people's projects. These only show
                      under the "Collaborations" filter, never under "All".
       role           (collaborations) what you did
       medium         instrumentation / forces / medium
       duration       e.g. "c. 14′"
       featured       true = listed on the landing page
       thumbnail      image used in the grid (empty = drawn placeholder)
       details        list of { label, value } (premiere, performers, commission…)
       description    list of paragraphs
       media          shown in order. Types:
                        { type: "image",   src: "media/…jpg", caption: "" }
                        { type: "video",   src: "media/…mp4", poster: "", caption: "" }
                        { type: "youtube", id: "I7Euya2zfg8", start: 0, caption: "" }
                        { type: "vimeo",   id: "123456789", caption: "" }
                        { type: "audio",   src: "media/…mp3", caption: "" }
                        { type: "embed",   src: "https://…", height: 152, caption: "" }
       links          list of { label, url } — score, press, release…
  */
  categories: ["Composition", "Electroacoustic", "Multimedia", "Installation", "Performance"],

  works: [
    /* ======================= OWN WORKS ======================= */
    {
      slug: "aparicion",
      title: "APARICIÓN",
      year: 2026,
      tags: ["Multimedia", "Performance"],
      medium: "Three performers, live video, real-time 3D and camera tracking",
      duration: "",          // e.g. "c. 14′" — leave empty to hide
      featured: true,
      thumbnail: "media/works/aparicion/02.jpg",
      details: [
        { label: "Performed", value: "Multimedia Composition concert, Hamburg (Feb 2026)<br>Blurred Edges Festival, Hamburg (Jun 2026)<br>Stimme X Festival, Hamburg (Jun 2026)" }
      ],
      description: [
        "In <em>APARICIÓN</em>, three performers build and explore a world existing simultaneously in physical and digital realms. Through microphones, live video and motion tracking for camera movement, the performers attempt to access what lies beyond life. The mechanics of the piece are deliberately exposed: the audience can watch how the camera works and how microphones focus on the objects they amplify.",
        "Over the course of the piece, the performers build an everyday scene from an old house: a rug, a wooden chair, a lamp and a series of small ceramic objects. As the performance unfolds, a spectral presence begins to manifest. The on-screen world drifts away from the stage, objects seem to move of their own accord, and sounds become dislocated from their sources.",
        "<em>APARICIÓN</em> operates as a polyphony of interacting stage elements. At times the audience sees a genuine live video feed; at others, a 3D world appears with startling realism. Sound design and stage lighting occasionally take precedence and become the primary focus."
      ],
      media: [
        { type: "youtube", id: "I7Euya2zfg8", caption: "Full video of the piece" },
        { type: "image", src: "media/works/aparicion/01.jpg", caption: "Performance view" },
        { type: "image", src: "media/works/aparicion/03.jpg", caption: "Performance view" },
        { type: "image", src: "media/works/aparicion/04.jpg", caption: "Ceramic objects on stage" },
        { type: "image", src: "media/works/aparicion/06.jpg", caption: "Live 3D rendering in Unreal Engine" },
        { type: "image", src: "media/works/aparicion/07.jpg", caption: "Live 3D rendering in Unreal Engine" },
        { type: "image", src: "media/works/aparicion/05.jpg", caption: "Detail" }
      ],
      links: []
    },
    {
      slug: "animacion",
      title: "ANIMACIÓN",
      year: 2026,
      tags: ["Multimedia", "Performance", "Composition"],
      medium: "Dancer, string quartet, real-time 3D and motion tracking",
      duration: "",          // e.g. "c. 14′" — leave empty to hide
      featured: true,
      thumbnail: "media/works/animacion/02.jpg",
      details: [
        { label: "Performed", value: "Multimedia Composition concert, Hamburg (Jul 2026)" },
        { label: "Status", value: "Work in progress" }
      ],
      description: [
        "Imagine a bottle. A glass bottle. The bottle is just sitting there, still. Suddenly, the bottle moves. It wiggles. It dances to a rhythm. The bottle is animated. It lives. The bottle is kind of cute. The bottle is our friend.",
        "Imagine a body. A human body. The body is breathing, slowly. Suddenly, the breathing stops. The body falls to the ground. The body is dragged away. It ragdolls. Nothing is cute anymore. No more humanity.",
        "<em>ANIMACIÓN</em> investigates the mechanisms by which the essence of the human form, or humanity itself, is diminished or stripped away. Through live motion tracking applied interchangeably to unexpected inanimate objects and live human avatars, the work explores how empathy develops, grows and dissolves. This connection is presented as an incomplete link, full of tensions and glitches, in which the transference of life is neither clean nor perfect."
      ],
      media: [
        { type: "youtube", id: "HZIm-L01DT0", caption: "Full video (work in progress)" },
        { type: "image", src: "media/works/animacion/01.jpg", caption: "" },
        { type: "image", src: "media/works/animacion/03.jpg", caption: "" }
      ],
      links: []
    },
    {
      slug: "zoom",
      title: "ZOOM",
      year: 2025,
      tags: ["Multimedia", "Electroacoustic"],
      medium: "Clarinet, live electronics and video",
      duration: "",          // e.g. "c. 14′" — leave empty to hide
      featured: true,
      thumbnail: "media/works/zoom/01.jpg",
      details: [
        { label: "Performer", value: "Adrián Sandi, clarinet" },
        { label: "Premiere", value: "Universidad Católica de Chile, 2025" },
        { label: "Context", value: "Interdisciplinary Composition Workshop, organised by Miguel Farías and Rodrigo Cádiz" }
      ],
      description: [
        "<em>ZOOM</em> explores the act of instrumental performance by taking a close look at the physical and visual aspects of sound production. The camera is pointed at different parts of the performer, framing the clarinettist’s actions through radical changes of scale in the image.",
        "At the same time, both the video and the sound are gradually transformed by digital means, blurring the line between human performance and electronic sound production."
      ],
      media: [
        { type: "youtube", id: "pEcZW8UZyVw", caption: "Adrián Sandi, clarinet. Universidad Católica de Chile, 2025" },
        { type: "image", src: "media/works/zoom/02.jpg", caption: "" },
        { type: "image", src: "media/works/zoom/03.jpg", caption: "" }
      ],
      links: []
    },
    {
      slug: "polifonia-1",
      title: "Polifonía 1",
      year: 2025,
      tags: ["Performance", "Electroacoustic", "Composition"],
      medium: "Composed theatre for two speakers, recorded voices and electronics",
      duration: "",          // e.g. "c. 14′" — leave empty to hide
      thumbnail: "media/works/polifonia-1/01.jpg",
      details: [
        { label: "Performed", value: "“Intrafonías”, organised by Anilla MAC, Museum of Contemporary Art, Santiago de Chile" }
      ],
      description: [
        "In <em>Polifonía 1</em>, a conversation intertwines with Bach’s Prelude No. 8 in E-flat major. In this intersection, the polyphony of the music extends into the text, giving new literary and poetic meanings to the original conversation. The dialogue unfolds on several levels: live speakers, recorded voices, transformed voices and fully electroacoustic sound. Through its three variations, the piece brings forth a third person in the conversation, referenced in the text. A soft, ghostly humming acts as a bridge between Baroque harmony and the dialogue between the two speakers.",
        "<em>Polifonía 1</em> is the first in a series of music-theatre pieces exploring the relationship between text, musicality and stage elements. By using scores not only for music but also for text, action, rhythm and space, the work translates the parameters of musical composition into the performative and scenic realm, treating all materials as musical materials."
      ],
      media: [
        { type: "youtube", id: "0KHodaGsY1U", caption: "Excerpt, “Intrafonías”, Museum of Contemporary Art, Santiago" },
        { type: "image", src: "media/works/polifonia-1/02.jpg", caption: "" },
        { type: "image", src: "media/works/polifonia-1/03.jpg", caption: "Score for text, voices and action (excerpt)" }
      ],
      links: []
    },
    {
      slug: "evaristo",
      title: "Evaristo",
      year: 2024,
      tags: ["Composition"],
      medium: "Symphony orchestra",
      duration: "11′",          // e.g. "c. 14′" — leave empty to hide
      thumbnail: "media/works/evaristo/02.jpg",
      details: [
        { label: "Commission", value: "Antofagasta Symphony Orchestra, 2024 season" },
        { label: "Premiere", value: "Antofagasta Symphony Orchestra, 2024" }
      ],
      description: [
        "<em>Evaristo</em> was commissioned by the Antofagasta Symphony Orchestra for its 2024 season. The piece is inspired by the <em>animita</em> of Evaristo Montt, a roadside shrine in the city of Antofagasta honouring a railway worker who died in an accident in 1914.",
        "Written for the 100th anniversary of the incident, and so of the birth of this popular figure in regional folklore, the piece reflects on history and the passage of time. It moves through soundscapes that evoke the desert’s arid vastness, dust swirling in the air, and the explosion of the locomotive: a chance event that gave rise to a hundred-year-old legend."
      ],
      media: [
        { type: "youtube", id: "hUezY_2puW4", caption: "Antofagasta Symphony Orchestra" },
        { type: "image", src: "media/works/evaristo/02.jpg", caption: "Score, first page" }
      ],
      links: [
        { label: "Programme notes (PDF)", url: "https://culturaantofagasta.cl/wp-content/uploads/2024/05/notasgallegos3ero.pdf" },
        { label: "Interview about the piece, ADN Radio", url: "https://www.adnradio.cl/2024/05/17/luciano-correa-en-busca-de-nuevos-espacios-para-la-composicion/" }
      ]
    },
    {
      slug: "dispositivo-1",
      title: "Dispositivo 1: Asiento por favor",
      year: 2023,
      tags: ["Installation", "Electroacoustic"],
      medium: "Interactive sound installation built from a chair",
      duration: "",          // e.g. "c. 14′" — leave empty to hide
      thumbnail: "media/works/dispositivo-1/01.jpg",
      details: [
        { label: "Exhibited", value: "Museum of Contemporary Art, Parque Forestal, Santiago, as part of “Efímera_” by Anilla MAC (three days)" },
        { label: "Performances", value: "Consuelo Robledo" }
      ],
      description: [
        "<em>Dispositivo 1: Asiento por favor</em> is a sound installation built around an acoustic and electroacoustic instrument made from an everyday object: a chair. Visitors are invited to engage with the piece, exploring its logic (or lack thereof) while affecting the sound environment of the space through their actions.",
        "The work brings out the sonic qualities of everyday objects through amplification, transformation and estrangement. The sound of the chair is distorted as it travels through the space, enveloping the audience and changing the soundscape as the interactions with the object vary.",
        "Alongside the exhibition, Consuelo Robledo gave two performances using the installation as an instrument for a composition of movement and sound."
      ],
      media: [
        { type: "youtube", id: "xsXy-xOtl0U", caption: "Full performance" },
        { type: "youtube", id: "ZjglqguY3aY", caption: "Installation example" },
        { type: "image", src: "media/works/dispositivo-1/02.jpg", caption: "" },
        { type: "image", src: "media/works/dispositivo-1/03.jpg", caption: "" }
      ],
      links: [
        { label: "Museum of Contemporary Art, Santiago", url: "https://mac.uchile.cl/actividades/efimera_-dispositivo-1-asiento-por-favor/" }
      ]
    },
    {
      slug: "tercera-hipotesis-de-lucha",
      title: "Tercera Hipótesis de Lucha",
      year: 2021,
      tags: ["Multimedia", "Electroacoustic", "Composition"],
      medium: "Ensemble, conductor, electronics and video",
      duration: "",          // e.g. "c. 14′" — leave empty to hide
      thumbnail: "media/works/tercera-hipotesis-de-lucha/01.jpg",
      details: [
        { label: "Performers", value: "Ensamble Palimpsesto, first concert of the 2021 virtual season" },
        { label: "English title", value: "Third Fight Hypothesis" }
      ],
      description: [
        "<em>Tercera Hipótesis de Lucha</em> challenges the traditional functioning of an ensemble in the virtual realm, using the conductor as another performer and the voices and bodies of the performers as musical material. It also asks questions about the image of the person performing a piece, and how the viewer’s gaze constructs that event.",
        "The piece presents a series of sound and visual landscapes made with electronics and video editing. The initial text becomes rhythmic material that gradually transforms in meaning, while the video builds these processes through different arrangements of the performers in space.",
        "The electronics and video can only be completed once the performers have recorded their parts, which gives the piece a recursive, self-contained character. Video cues in the score guide possible interpretations."
      ],
      media: [
        { type: "youtube", id: "weobE4isyu0", start: 1222, caption: "Ensamble Palimpsesto, 2021 virtual season" },
        { type: "image", src: "media/works/tercera-hipotesis-de-lucha/02.jpg", caption: "" },
        { type: "image", src: "media/works/tercera-hipotesis-de-lucha/03.jpg", caption: "" }
      ],
      links: [
        { label: "Full score", url: "https://drive.google.com/file/d/1ScMmTNcwiEV3AuCh8Z8Io2ArDUGA7iJW/view?usp=sharing" }
      ]
    },
    {
      slug: "hilos",
      title: "Hilos",
      year: 2021,
      tags: ["Composition"],
      medium: "Alto saxophone",
      duration: "",          // e.g. "c. 14′" — leave empty to hide
      thumbnail: "media/works/hilos/01.jpg",
      details: [
        { label: "Premiere", value: "David Sánchez, XXX Festival de Música Contemporánea UC, Santiago, 2021" }
      ],
      description: [
        "<em>Hilos</em> explores the techniques, textures and speeds of the alto saxophone through the metaphor of a thread: a strand that moves back and forth, passing through a single point that, over time, connects fragments of different materials, creating a bridge where there was once emptiness. The music accelerates and slows down, following the impulses of its materials: at times anxious and bursting with energy, at others calm, with an almost imperceptible development.",
        "Meanwhile, an arpeggio gradually takes shape as the thread weaves through each material, establishing a harmony note by note that later appears in a more transparent form."
      ],
      media: [
        { type: "youtube", id: "f-e1OMWW5w0", start: 2224, caption: "David Sánchez, XXX Contemporary Music Festival UC, 2021" },
        { type: "image", src: "media/works/hilos/02.jpg", caption: "Score excerpt" }
      ],
      links: [
        { label: "Full score", url: "https://drive.google.com/file/d/1OsR98MCamILG_Yk62Q1xtBp9S9D2f7lr/view?usp=sharing" }
      ]
    },
    {
      slug: "ejercicios-de-respiracion",
      title: "Ejercicios de respiración",
      year: 2021,
      tags: ["Composition"],
      medium: "Oboe without reed",
      duration: "",          // e.g. "c. 14′" — leave empty to hide
      thumbnail: "media/works/ejercicios-de-respiracion/01.jpg",
      details: [
        { label: "Commission", value: "José Luis Urquieta, oboe" },
        { label: "Premiere", value: "Festival MusicAhora, La Serena, 2021" },
        { label: "English title", value: "Breathing Exercises" }
      ],
      description: [
        "This piece explores the aeolian sonorities of the oboe played without a reed, using breathing techniques, vocal modulations, articulations, pronunciations and dynamics to build a musical discourse from this unconventional use of the instrument.",
        "<em>Ejercicios de respiración</em> is both a study of this approach and a meditative piece that pushes interpretation towards the body. The intensity and frequency of the performer’s breathing are treated as musical material, creating moments of tension and release in the music and in the act of breathing itself. This demands the performer’s full presence and physical effort."
      ],
      media: [
        { type: "youtube", id: "I19ZTMTKOH4", caption: "José Luis Urquieta, Festival MusicAhora, 2021" },
        { type: "image", src: "media/works/ejercicios-de-respiracion/02.jpg", caption: "Score excerpt" }
      ],
      links: [
        { label: "Full score", url: "https://drive.google.com/file/d/1v3epVI223IxfJ_Sz9PHRo8r5qVVJNhDb/view?usp=sharing" }
      ]
    },
    {
      slug: "vertigo",
      title: "Vértigo",
      year: 2020,
      tags: ["Composition"],
      medium: "Voice and piano. Text by Alessandra Molina",
      duration: "",          // e.g. "c. 14′" — leave empty to hide
      thumbnail: "media/works/vertigo/01.jpg",
      details: [
        { label: "Award", value: "Winner, “Franz Schubert und die Musik der Moderne” 2020, University of Music and Performing Arts Graz" },
        { label: "Performers", value: "André Baleiro and Pedro Costa" }
      ],
      description: [
        "In the text the piece is based on, Alessandra Molina uses the image of a bird as an object of artistic appreciation, giving it a grotesque and visceral twist. The description highlights the bird’s animal, contradictory and wild qualities, as if it were completely alien to the human gaze.",
        "The fall of this bird lies at the core of the musical material: voice and piano ascend in one way and descend in another, contrasting harmonic leaps with a chaotic descent full of chromaticism and erratic movement. The spoken voice works as a parenthesis to the singing, a different point of view on the bird’s fall that reveals new qualities of the animal."
      ],
      media: [
        { type: "youtube", id: "2Utyd3VNQq4", start: 111, caption: "André Baleiro and Pedro Costa, winners of the Franz Schubert und die Musik der Moderne 2020 Lied competition" },
        { type: "image", src: "media/works/vertigo/02.jpg", caption: "Score, first page" }
      ],
      links: [
        { label: "Full score", url: "https://drive.google.com/file/d/1CoG_6DZOSGiY4v_lfmefNTP_UAHUn-7S/view?usp=sharing" }
      ]
    },
    {
      slug: "streaming-01",
      title: "STREAMING_01",
      year: 2020,
      tags: ["Multimedia", "Electroacoustic", "Performance"],
      medium: "Performer, webcam and interactive Max/MSP patch, with text score",
      duration: "",          // e.g. "c. 14′" — leave empty to hide
      thumbnail: "media/works/streaming-01/01.jpg",
      details: [],
      description: [
        "Composed during the global pandemic, <em>STREAMING_01</em> challenges the notions of gaze and surveillance in digital communication. Using the device’s camera, the piece creates a tension between the performer’s presence and absence by transforming their voice and image through the digital distortion and saturation inherent to the medium.",
        "The performer’s identity shifts between clarity and concealment until the climax, where their image disappears and only the voice remains. Meanwhile, the program autonomously generates a text as a conclusion and synthesis of the piece.",
        "The piece was programmed in Max/MSP and comes with a text score, which the performer recites while pressing keys that trigger effects, electroacoustic clips and other events."
      ],
      media: [
        { type: "youtube", id: "7bEkPmQYBgk", caption: "Video" },
        { type: "image", src: "media/works/streaming-01/02.jpg", caption: "" }
      ],
      links: []
    },

    /* ======================= COLLABORATIONS =======================
       Only visible under the "Collaborations" filter. */
    {
      slug: "prenderse-fuego",
      collaboration: true,
      title: "Prenderse Fuego: Las voces de Pedro Lemebel",
      year: 2026,
      tags: ["Podcast"],
      role: "Sound design and composition",
      medium: "Documentary podcast, Podium Podcast",
      thumbnail: "media/works/prenderse-fuego/cover.jpg",
      details: [],
      description: [],
      media: [],
      links: [{ label: "Listen on Spotify", url: "https://open.spotify.com/show/033Pwahv5S8NUSd7NwiW7S" }]
    },
    {
      slug: "rey-del-oro",
      collaboration: true,
      title: "Rey del Oro",
      year: 2025,
      tags: ["Podcast"],
      role: "Sound design and composition",
      medium: "Documentary podcast, Podium Podcast",
      thumbnail: "media/works/rey-del-oro/cover.jpg",
      details: [],
      description: [],
      media: [],
      links: [{ label: "Listen on Spotify", url: "https://open.spotify.com/show/29Sg26fLEtLrPr1uhpEQ1i" }]
    },
    {
      slug: "necesito-poder-respirar",
      collaboration: true,
      title: "Necesito Poder Respirar: La vida de Jorge González",
      year: 2024,
      tags: ["Podcast"],
      role: "Production, composition, sound design and mixing",
      medium: "Documentary podcast, Podium Podcast",
      thumbnail: "media/works/necesito-poder-respirar/cover.jpg",
      details: [],
      description: [
        "A documentary podcast on the life of Jorge González. Produced, composed, sound designed and mixed by Luciano Correa; recognised and praised both in Chile and internationally."
      ],
      media: [],
      links: [{ label: "Listen on Spotify", url: "https://open.spotify.com/show/1uMWT5wwErNmOFJjrn84lk" }]
    },
    {
      slug: "reloj-viejo-de-pared",
      collaboration: true,
      title: "Reloj Viejo de Pared",
      year: 2024,
      tags: ["Theatre"],
      role: "Live sound, sound design, arrangements, composition, building and programming of sound devices",
      medium: "Theatre, directed by Vicente Larroulet (Acto Cero Compañía)",
      thumbnail: "",
      details: [],
      description: [],
      media: [],
      links: []
    },
    {
      slug: "quien-mato-a-anna-cook",
      collaboration: true,
      title: "Quién mató a Anna Cook",
      year: 2023,
      tags: ["Podcast"],
      role: "Sound design and composition",
      medium: "Documentary podcast, Podium Podcast",
      thumbnail: "media/works/quien-mato-a-anna-cook/cover.jpg",
      details: [],
      description: [],
      media: [],
      links: [{ label: "Listen on Spotify", url: "https://open.spotify.com/show/4Nc0HwoQLWTFGYnVAp0e7i" }]
    },
    {
      slug: "la-grabacion",
      collaboration: true,
      title: "La Grabación",
      year: 2023,
      tags: ["Theatre"],
      role: "Recording, sound design, composition and mixing",
      medium: "Radio theatre, directed by Elisa Zulueta (Fundación Teatro a Mil). With Delfina Guzmán and Elisa Zulueta",
      thumbnail: "",
      details: [],
      description: [],
      media: [],
      links: []
    },
    {
      slug: "corderos",
      collaboration: true,
      title: "Corderos",
      year: 2022,
      tags: ["Podcast"],
      role: "Sound design, foley and composition",
      medium: "Audio drama, Podium Podcast (seasons 1–2, 2022–2024)",
      thumbnail: "media/works/corderos/cover.jpg",
      details: [
        { label: "Awards", value: "Ondas Award for Best Fiction, 2024<br>Ondas Award nominations for Best Sound Design, 2024 and 2025" }
      ],
      description: [],
      media: [],
      links: [{ label: "Listen on Spotify", url: "https://open.spotify.com/show/0WrtLQinDhpPukhK7MlJoj" }]
    },
    {
      slug: "la-gata-sobre-el-tejado-de-zinc-caliente",
      collaboration: true,
      title: "La Gata sobre el Tejado de Zinc Caliente",
      year: 2022,
      tags: ["Theatre"],
      role: "Composition and music production",
      medium: "Theatre, directed by Álvaro Viguera (La Santa Producciones, Teatro Municipal de Las Condes)",
      thumbnail: "",
      details: [],
      description: [],
      media: [],
      links: []
    },
    {
      slug: "luciano-altair",
      collaboration: true,
      title: "Luciano Altair",
      year: "2020–2025",
      tags: ["Music"],
      role: "Songwriting, music production, live performance",
      medium: "Song project, with Probeta Music (Valparaíso)",
      thumbnail: "media/works/luciano-altair/01.jpg",
      details: [
        { label: "Releases", value: "<em>Heridas</em> (LP, 2024)<br><em>Adentro</em> (single, 2023)" }
      ],
      description: [
        "A song project creating an atmosphere both intimate and expansive, with an emphasis on sound design and texture. The first single came out in 2020, and since then the project has worked with Probeta Music, a label based in Valparaíso, Chile.",
        "The debut album <em>Heridas</em> (January 2024) has seven songs about melancholy, grief and the search for hope in unexpected places. It was well received by critics in Chile and abroad."
      ],
      media: [
        { type: "image", src: "media/works/luciano-altair/heridas.jpg", caption: "<em>Heridas</em> (LP, 2024)" },
        { type: "image", src: "media/works/luciano-altair/adentro.jpg", caption: "<em>Adentro</em> (single, 2023)" }
      ],
      links: [
        { label: "Heridas on Spotify", url: "https://open.spotify.com/album/4Sz3PniOl2XJdXnjpe2EQX" },
        { label: "Adentro on Spotify", url: "https://open.spotify.com/album/1MxexBi0FyDgHnRnlxyR8y" },
        { label: "Artist profile on Spotify", url: "https://open.spotify.com/artist/5zYGj1hsIxc6gjoLLTs9IQ" }
      ]
    }
  ],

  /* ---------- About ---------- */
  about: {
    portrait: "media/about/portrait.jpg",
    portraitCaption: "",
    bio: [
      "Luciano Correa Barraza (Antofagasta, Chile, 1995) is a composer, sound artist and multimedia artist with a deep interest in interdisciplinary work and stage performance. He studied for a Bachelor’s degree in Music, specialising in composition, at the Pontificia Universidad Católica de Chile with Miguel Farías, Aliocha Solovera and Cristian Morales. He has also trained in electroacoustics, new media, interactive media and programming through workshops, courses and self-directed study, and has studied hybrid methods of composition between music, theatre and staging with director and composer Angelo Solari. He is currently studying Multimedia Composition at the Hochschule für Musik und Theater Hamburg with Georg Hajdu and Alexander Schubert.",
      "He composes music for theatre, in a practice closely tied to stage performance, collaborating with directors such as Álvaro Viguera, Elisa Zulueta and Vicente Larroulet. Since 2022 he has worked with the audio platform Podium Podcast as a sound designer and composer for audio fiction and documentary productions, work that has been recognised and awarded in Chile and Spain.",
      "His work as a composer and sound artist has been recognised in national and international competitions and calls. His pieces have been presented at several editions of the Contemporary Music Festival of the Pontificia Universidad Católica de Chile, Klub Katarakt (Hamburg), Stimme X (Hamburg), the MusicAhora Festival (Chile) and the Museum of Contemporary Art (Santiago, Chile)."
    ],
    cvFile: "media/Luciano-Correa_Dossier_2026_EN.pdf",
    cvLabel: "Dossier 2026 (PDF)",
    cv: [
      {
        heading: "Education and training",
        items: [
          { year: "2026", text: "MIXTUR International Workshop with Simon Steen-Andersen, Isabel Mundry and Sarah Nemtsov. Barcelona, Spain" },
          { year: "2025-–", text: "Master’s in Multimedia Composition, Hochschule für Musik und Theater Hamburg, Germany" },
          { year: "2025", text: "Workshop “Interdisciplinary Composition”, organised by Miguel Farías and Rodrigo Cádiz. Universidad Católica de Chile, Santiago" },
          { year: "2024", text: "“Fuera de Campo”, training programme in sound art, Fundación Urdimbre. Online" },
          { year: "2024", text: "Workshop “Teatro Compuesto” and stage performance, with Angelo Solari. Santiago, Chile" },
          { year: "2024", text: "Workshop “Music-Theatrical Composition”, Teatro de la Memoria. Santiago, Chile" },
          { year: "2023", text: "International course “New Opera”, Fundación Atlanticx. Buenos Aires, Argentina" },
          { year: "2023", text: "Creative training programme “Interactive Media”, Academia Sinestesia. Santiago, Chile" },
          { year: "2020", text: "Bachelor’s degree in Music, specialising in Composition, Pontificia Universidad Católica de Chile" }
        ]
      },
      {
        heading: "Awards and recognition",
        items: [
          { year: "2025", text: "Ondas Award nomination, Best Sound Design, for the audio fiction <em>Corderos</em> (season 2). Prisa Media, Spain" },
          { year: "2024", text: "Ondas Award for Best Fiction for <em>Corderos</em>. Prisa Media, Spain" },
          { year: "2024", text: "Ondas Award nomination, Best Sound Design, for <em>Corderos</em>. Prisa Media, Spain" },
          { year: "2024", text: "International creative residency “New Opera” with Morgan Ashkenazy. Fundación Williams, Argentina" },
          { year: "2020", text: "First prize, “Franz Schubert und die Musik der Moderne” composition competition, University of Music and Performing Arts Graz, Austria" },
          { year: "2019", text: "Third prize, Nuevo Mundo Baroque Orchestra composition competition. O’Higgins Region, Chile" },
          { year: "2018", text: "Sole winner, Composition Chair competition, Pontificia Universidad Católica de Chile" },
          { year: "2018", text: "Second prize, Fifth Composition Competition of the Marga Marga Orchestra. Valparaíso, Chile" }
        ]
      }
    ]
  }
};
