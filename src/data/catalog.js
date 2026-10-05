// Catálogo de música de Josse Music.
// audioSrc usa pistas de muestra libres de derechos como placeholder de demo;
// el artista puede sustituirlas por sus archivos reales subiéndolos a public/audio.
const SAMPLE_1 =
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8e6e0f313.mp3?filename=lofi-study-112191.mp3";
const SAMPLE_2 =
  "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=abstract-fashion-pop-2021-15413.mp3";
const SAMPLE_3 =
  "https://cdn.pixabay.com/download/audio/2021/11/25/audio_00fa5b71ad.mp3?filename=smooth-rnb-loop-9963.mp3";

export const catalog = [
  {
    id: "s1",
    title: "Cuando Tú No Estás",
    type: "Sencillo",
    year: "2024",
    price: 2,
    audioSrc: SAMPLE_1,
  },
  {
    id: "s2",
    title: "Piel de Habana",
    type: "Sencillo",
    year: "2024",
    price: 2,
    audioSrc: SAMPLE_2,
  },
  {
    id: "s3",
    title: "Noches Sin Ti",
    type: "Sencillo",
    year: "2023",
    price: 2,
    audioSrc: SAMPLE_3,
  },
  {
    id: "a1",
    title: "Íntimo — Álbum",
    type: "Álbum",
    year: "2023",
    price: 8,
    audioSrc: SAMPLE_2,
  },
  {
    id: "a2",
    title: "Terciopelo Urbano",
    type: "Álbum",
    year: "2022",
    price: 8,
    audioSrc: SAMPLE_1,
  },
  {
    id: "s4",
    title: "Vino y Melodía",
    type: "Sencillo",
    year: "2022",
    price: 2,
    audioSrc: SAMPLE_3,
  },
];
