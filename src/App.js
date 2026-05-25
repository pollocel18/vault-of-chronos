/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

const API = process.env.REACT_APP_API;

// Silent wake up
fetch(`${API}/`).catch(() => {});

function getDaysUntilBirthday(dateStr) {
  const today = new Date();
  const parts = dateStr.split("-");
  const month = parseInt(parts[1] || parts[0]);
  const day = parseInt(parts[2] || parts[1]);
  let next = new Date(today.getFullYear(), month - 1, day);
  if (next < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    next = new Date(today.getFullYear() + 1, month - 1, day);
  }
  const diff = Math.ceil((next - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / (1000 * 60 * 60 * 24));
  return diff;
}

function getAge(dateStr) {
  const parts = dateStr.split("-");
  if (parts.length < 3) return null;
  const [year, month, day] = parts.map(Number);
  if (!year || year < 1900) return null;
  const today = new Date();
  let age = today.getFullYear() - year;
  const hasBirthdayPassed = today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);
  if (!hasBirthdayPassed) age--;
  return age;
}

function getAgeOnNextBirthday(dateStr) {
  const parts = dateStr.split("-").map(Number);
  if (parts.length < 3) return null;
  const [year, month, day] = parts;
  if (!year || year < 1900) return null;
  const today = new Date();
  const currentAge = today.getFullYear() - year;
  const hasBirthdayPassed = today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);
  return hasBirthdayPassed ? currentAge + 1 : currentAge;
}

function zodiacSign(dateStr) {
  const parts = dateStr.split("-");
  const month = parseInt(parts[1] || parts[0]);
  const day = parseInt(parts[2] || parts[1]);
  const signs = [
    { sign: "Capricorn ♑", end: [1,19] }, { sign: "Aquarius ♒", end: [2,18] },
    { sign: "Pisces ♓", end: [3,20] }, { sign: "Aries ♈", end: [4,19] },
    { sign: "Taurus ♉", end: [5,20] }, { sign: "Gemini ♊", end: [6,20] },
    { sign: "Cancer ♋", end: [7,22] }, { sign: "Leo ♌", end: [8,22] },
    { sign: "Virgo ♍", end: [9,22] }, { sign: "Libra ♎", end: [10,22] },
    { sign: "Scorpio ♏", end: [11,21] }, { sign: "Sagittarius ♐", end: [12,21] },
    { sign: "Capricorn ♑", end: [12,31] },
  ];
  for (const s of signs) {
    if (month < s.end[0] || (month === s.end[0] && day <= s.end[1])) return s.sign;
  }
  return "";
}

function getZodiacName(dateStr) {
  const sign = zodiacSign(dateStr);
  const names = ["Capricorn","Aquarius","Pisces","Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius"];
  return names.find(n => sign.startsWith(n)) || "";
}

// ─── TONALI: Mexica Calendar Calculation ─────────────────────────────────────
const SIGNOS_TONALPOHUALLI = [
  { nombre: "Cipactli", emoji: "🐊", desc: "Caiman — Primordial force, origin of the world, creative energy." },
  { nombre: "Ehecatl", emoji: "💨", desc: "Wind — Messenger of the gods, mobility, transformation." },
  { nombre: "Calli", emoji: "🏠", desc: "House — Shelter, introspection, deep inner world." },
  { nombre: "Cuetzpalin", emoji: "🦎", desc: "Lizard — Agility, adaptation, renewed vitality." },
  { nombre: "Coatl", emoji: "🐍", desc: "Serpent — Ancestral wisdom, duality, rebirth." },
  { nombre: "Miquiztli", emoji: "💀", desc: "Death — Transformation, passage between worlds, eternal cycle." },
  { nombre: "Mazatl", emoji: "🦌", desc: "Deer — Grace, intuition, connection with nature." },
  { nombre: "Tochtli", emoji: "🐇", desc: "Rabbit — Abundance, fertility, boundless joy." },
  { nombre: "Atl", emoji: "💧", desc: "Water — Fluidity, purification, life and constant movement." },
  { nombre: "Itzcuintli", emoji: "🐕", desc: "Dog — Loyalty, guide to the underworld, companionship." },
  { nombre: "Ozomatli", emoji: "🐒", desc: "Monkey — Art, play, wit and creativity without limits." },
  { nombre: "Malinalli", emoji: "🌿", desc: "Grass — Resilience, rebirth, that which cannot be destroyed." },
  { nombre: "Acatl", emoji: "🎋", desc: "Reed — Wisdom of Quetzalcoatl, knowledge and the word." },
  { nombre: "Ocelotl", emoji: "🐆", desc: "Jaguar — Nocturnal power, warrior of darkness, mystery." },
  { nombre: "Cuauhtli", emoji: "🦅", desc: "Eagle — Solar vision, leadership, flies higher than all." },
  { nombre: "Cozcacuauhtli", emoji: "🦅", desc: "Vulture — Wisdom of elders, patience and longevity." },
  { nombre: "Ollin", emoji: "🌀", desc: "Movement — Sign of the current sun, destiny in action." },
  { nombre: "Tecpatl", emoji: "🔪", desc: "Flint — Sacrifice, cutting will, unfiltered truth." },
  { nombre: "Quiahuitl", emoji: "🌧️", desc: "Rain — Gifts from the sky, fertility, the voice of Tlaloc." },
  { nombre: "Xochitl", emoji: "🌸", desc: "Flower — Beauty, art, love and the blossoming of the soul." },
];

const SEÑORES_NOCHE = [
  { nombre: "Xiuhtecuhtli", desc: "Lord of Fire — the most ancient, axis of the cosmos, transformation." },
  { nombre: "Itztli", desc: "Obsidian — edge of truth, clarity that cuts through the superficial." },
  { nombre: "Piltzintecuhtli", desc: "Young Lord — the child sun, fresh energy and renewal." },
  { nombre: "Centeotl", desc: "God of Corn — sustenance, abundance, that which nourishes the world." },
  { nombre: "Mictlantecuhtli", desc: "Lord of the Dead — depth, that which exists beyond." },
  { nombre: "Chalchiuhtlicue", desc: "Jade Skirt — moving waters, emotional fluidity, protection." },
  { nombre: "Tlazolteotl", desc: "Earth Goddess — purification, passion, that which transforms." },
  { nombre: "Tepeyollotl", desc: "Heart of the Mountain — the jaguar of echo, the resonating voice." },
  { nombre: "Tlaloc", desc: "God of Rain — gifts from the sky, life that comes from above." },
];

const SEÑORES_DIA = [
  "Xiuhtecuhtli","Tlaltecuhtli","Chalchiuhtlicue","Tonatiuh","Tlazolteotl",
  "Mictlantecuhtli","Centeotl","Tlaloc","Quetzalcoatl","Tezcatlipoca",
  "Chalmecatl","Tlahuizcalpantecuhtli","Citlalicue"
];

const MESES_SOLAR = [
  { nombre: "Atlcahualo", desc: "Cessation of waters" },
  { nombre: "Tlacaxipehualiztli", desc: "Flaying of men" },
  { nombre: "Tozoztontli", desc: "Small vigil" },
  { nombre: "Huey Tozoztli", desc: "Great vigil" },
  { nombre: "Toxcatl", desc: "The drought" },
  { nombre: "Etzalcualiztli", desc: "Meal of corn and beans" },
  { nombre: "Tecuilhuitontli", desc: "Small feast of the lords" },
  { nombre: "Huey Tecuilhuitl", desc: "Great feast of the lords" },
  { nombre: "Tlaxochimaco", desc: "Birth of flowers" },
  { nombre: "Xocotl Huetzi", desc: "Fall of the fruit" },
  { nombre: "Ochpaniztli", desc: "The sweeping" },
  { nombre: "Teotleco", desc: "Arrival of the gods" },
  { nombre: "Tepeilhuitl", desc: "Feast of the hills" },
  { nombre: "Quecholli", desc: "The precious heron" },
  { nombre: "Panquetzaliztli", desc: "Raising of banners — month of Huitzilopochtli, the Hummingbird of the South" },
  { nombre: "Atemoztli", desc: "Descent of water" },
  { nombre: "Tititl", desc: "Stretching" },
  { nombre: "Izcalli", desc: "Resurrection" },
  { nombre: "Nemontemi", desc: "Nameless days — unlucky, days of recollection" },
];

const SIGNOS_AÑO = [
  { nombre: "Tochtli", emoji: "🐇", desc: "Rabbit" },
  { nombre: "Acatl", emoji: "🎋", desc: "Reed" },
  { nombre: "Tecpatl", emoji: "🔪", desc: "Flint" },
  { nombre: "Calli", emoji: "🏠", desc: "House" },
];

function fechaAJDN(dia, mes, anio) {
  if (mes <= 2) { anio -= 1; mes += 12; }
  const A = Math.floor(anio / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (anio + 4716)) + Math.floor(30.6001 * (mes + 1)) + dia + B - 1524;
}

function calcularTonali(fechaStr) {
  const parts = fechaStr.split("-");
  const anio = parseInt(parts[0]);
  const mes = parseInt(parts[1]);
  const dia = parseInt(parts[2]);
  if (!anio || !mes || !dia) return null;

  const GMT = 584283;
  const jdn = fechaAJDN(dia, mes, anio);
  const tpDia = ((jdn - GMT) % 260 + 260) % 260;

  const numero = (tpDia % 13) + 1;
  const signoIndex = tpDia % 20;
  const signo = SIGNOS_TONALPOHUALLI[signoIndex];

  const inicioTrecena = tpDia - (numero - 1);
  const signoTrecenaIndex = ((inicioTrecena % 20) + 20) % 20;
  const signoTrecena = SIGNOS_TONALPOHUALLI[signoTrecenaIndex];

  const señorNocheIndex = ((jdn - GMT) % 9 + 9) % 9;
  const señorNoche = SEÑORES_NOCHE[señorNocheIndex];

  const señorDia = SEÑORES_DIA[numero - 1];

  const xiuhDia = ((jdn - GMT) % 365 + 365) % 365;
  const mesSolarIndex = Math.min(Math.floor(xiuhDia / 20), 18);
  const diaSolar = (xiuhDia % 20) + 1;
  const mesSolar = MESES_SOLAR[mesSolarIndex];

  const añosTranscurridos = Math.floor((jdn - GMT) / 365);
  const numAño = (((añosTranscurridos % 13) + 13) % 13) + 1;
  const signoAñoIndex = ((añosTranscurridos % 4) + 4) % 4;
  const signoAño = SIGNOS_AÑO[signoAñoIndex];

  return { numero, signo, signoTrecena, señorNoche, señorDia, diaSolar, mesSolar, numAño, signoAño };
}

const ZODIAC_DATA = {
  "Aries": {
    emoji: "♈", descripcion: "Pioneer, passionate and direct. Born to lead.",
    compatible: ["Leo", "Sagittarius", "Gemini"], evitar: ["Cancer", "Capricorn"],
    consejo: "Don't try to win an argument with them — it's simply not worth it.",
    fortaleza: "Boundless energy and courage", debilidad: "Impulsive and stubborn as a wall"
  },
  "Taurus": {
    emoji: "♉", descripcion: "Loyal, patient and a lover of pleasure. The friend who never lets you down.",
    compatible: ["Virgo", "Capricorn", "Cancer"], evitar: ["Aquarius", "Leo"],
    consejo: "Never rush them. They'll arrive when they arrive, and they'll arrive well.",
    fortaleza: "Consistency and reliability", debilidad: "Stubborn beyond belief when they've made up their mind"
  },
  "Gemini": {
    emoji: "♊", descripcion: "Curious, adaptable and brilliant. Two personalities in one.",
    compatible: ["Libra", "Aquarius", "Aries"], evitar: ["Pisces", "Virgo"],
    consejo: "Don't expect a quick decision. They have two minds running at once.",
    fortaleza: "Communication and wit", debilidad: "Inconsistent and hard to keep up with"
  },
  "Cancer": {
    emoji: "♋", descripcion: "Intuitive, protective and deeply emotional. The heart of the group.",
    compatible: ["Scorpio", "Pisces", "Taurus"], evitar: ["Aries", "Libra"],
    consejo: "Be careful with their feelings — they have an elephant's memory for wounds.",
    fortaleza: "Loyalty and overflowing empathy", debilidad: "Easily offended and holds grudges"
  },
  "Leo": {
    emoji: "♌", descripcion: "Charismatic, generous and spectacular. Born under the spotlight.",
    compatible: ["Aries", "Sagittarius", "Gemini"], evitar: ["Taurus", "Scorpio"],
    consejo: "Give them their place and recognition — it's not vanity, it's fuel.",
    fortaleza: "Natural leadership and generosity", debilidad: "An ego that sometimes takes up more space than they do"
  },
  "Virgo": {
    emoji: "♍", descripcion: "Analytical, helpful and perfectionist. The one who solves everything without complaining.",
    compatible: ["Taurus", "Capricorn", "Cancer"], evitar: ["Sagittarius", "Gemini"],
    consejo: "Don't tell them 'it's fine as is' when it isn't. They know.",
    fortaleza: "Precision and dedication", debilidad: "Critical of themselves and others"
  },
  "Libra": {
    emoji: "♎", descripcion: "Fair, charming and diplomatic. Hates conflict almost as much as they love harmony.",
    compatible: ["Gemini", "Aquarius", "Leo"], evitar: ["Cancer", "Capricorn"],
    consejo: "Don't make them choose. It's their kryptonite.",
    fortaleza: "Balance and people skills", debilidad: "Indecisive to infinity"
  },
  "Scorpio": {
    emoji: "♏", descripcion: "Intense, magnetic and mysterious. What you see is only the surface.",
    compatible: ["Cancer", "Pisces", "Capricorn"], evitar: ["Leo", "Aquarius"],
    consejo: "Never lie to them. They know before you finish the sentence.",
    fortaleza: "Determination and emotional depth", debilidad: "Resentful and jealous when they feel betrayed"
  },
  "Sagittarius": {
    emoji: "♐", descripcion: "Adventurous, philosophical and honest. Freedom is their religion.",
    compatible: ["Aries", "Leo", "Libra"], evitar: ["Virgo", "Pisces"],
    consejo: "Don't try to cage them. They'll leave without looking back.",
    fortaleza: "Optimism and thirst for knowledge", debilidad: "Struggles to commit and sometimes brutally honest"
  },
  "Capricorn": {
    emoji: "♑", descripcion: "Ambitious, disciplined and responsible. The one who finishes what they start.",
    compatible: ["Taurus", "Virgo", "Scorpio"], evitar: ["Aries", "Libra"],
    consejo: "Don't interrupt them when they're working. There are consequences.",
    fortaleza: "Perseverance and practical sense", debilidad: "Workaholic and sometimes emotionally cold"
  },
  "Aquarius": {
    emoji: "♒", descripcion: "Visionary, original and independent. Lives in the future.",
    compatible: ["Gemini", "Libra", "Sagittarius"], evitar: ["Taurus", "Scorpio"],
    consejo: "Don't tell them their idea is weird. To them that's a compliment.",
    fortaleza: "Originality and innovative thinking", debilidad: "Emotionally distant and very much in their own world"
  },
  "Pisces": {
    emoji: "♓", descripcion: "Dreamy, empathetic and creative. Lives between reality and another plane.",
    compatible: ["Cancer", "Scorpio", "Taurus"], evitar: ["Gemini", "Sagittarius"],
    consejo: "Don't bombard them with logic when they're in emotional mode. Wait.",
    fortaleza: "Intuition and boundless compassion", debilidad: "Gets lost in their own dreams and avoids confrontation"
  }
};

// ── Time Capsule: now goes through backend ────────────────────────────────────
async function fetchCapsula(token, nombre, fecha) {
  const parts = fecha.split("-");
  const day = parseInt(parts[2]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[0]);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const fechaTexto = `${months[month-1]} ${day}, ${year}`;
  const zodiacName = getZodiacName(fecha);

  const prompt = `The user wants to know curious and historical facts about the day ${nombre} was born: ${fechaTexto}. Their zodiac sign is ${zodiacName}.

Respond ONLY with a JSON object with exactly this structure, no additional text, no markdown, no backticks:

{
  "evento1": "An important historical event that occurred on that exact date (same day and month, any nearby year). Must be real.",
  "evento2": "Another different historical event from the same day or birth year.",
  "musica1": "The most popular artist or band in the birth year.",
  "musica2": "Another musical fact from that era — an iconic album, an emerging genre, etc.",
  "entretenimiento1": "A famous TV show, movie or cartoon from that era.",
  "entretenimiento2": "Another different show, movie or cartoon from the same year.",
  "deporte1": "An important sports achievement from the birth year (soccer, boxing, athletics, etc.).",
  "deporte2": "Another sports achievement from that year in a different discipline.",
  "luna": "The approximate moon phase for that exact date (Full Moon, New Moon, First Quarter, Last Quarter).",
  "precio": "A curious price of something everyday in that year (food, movies, gas, etc.) with a comparison to today.",
  "dato_curioso": "A surprising or fun fact about that year or date.",
  "recomendacion": "A fun life recommendation with humor for ${nombre} based on their ${zodiacName} sign. Something they could try, with a comedic twist related to their sign's personality."
}`;

  const response = await fetch(`${API}/api/capsula`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error('Could not load the time capsule');
  return response.json();
}

// ── Akashic Records: now goes through backend ─────────────────────────────────
async function fetchAkashic(token, persona) {
  const parts = persona.fecha.split("-");
  const anio = parseInt(parts[0]);
  const mes = parseInt(parts[1]);
  const dia = parseInt(parts[2]);
  const signoZodiacal = getZodiacName(persona.fecha);
  const tonaliData = calcularTonali(persona.fecha);
  const reducir = n => { while (n > 9 && n !== 11 && n !== 22 && n !== 33) { n = String(n).split("").reduce((a, b) => a + parseInt(b), 0); } return n; };
  const numVida = reducir(dia + mes + anio);

  const prompt = `You are an expert reader of Akashic Records with deep knowledge of numerology, astrology, and Mesoamerican cosmovision. Based on this person's data, generate a deep, poetic and very personal akashic reading. Do NOT use generic language — speak directly to this person's soul as if you could truly see their unique record.

Person's data:
- Name: ${persona.nombre}
- Date of birth: ${mes}/${dia}/${anio}
- Zodiac sign: ${signoZodiacal}
- Mexica Tonali: ${tonaliData ? `${tonaliData.numero} ${tonaliData.signo.nombre}` : "unknown"}
- Trecena: ${tonaliData ? `Ce ${tonaliData.signoTrecena.nombre}` : "unknown"}
- Lord of the Night: ${tonaliData ? tonaliData.señorNoche.nombre : "unknown"}
- Solar month: ${tonaliData ? tonaliData.mesSolar.nombre : "unknown"}
- Life number (numerology): ${numVida}
- Day number: ${dia}

Respond ONLY with a JSON object with exactly this structure, no additional text, no markdown, no backticks:

{
  "proposito": "The soul's purpose in this incarnation — 3 to 4 intimate and specific sentences based on the data.",
  "dones": "The gifts and talents brought from past lives — 3 to 4 poetic and specific sentences.",
  "karma": "The karmic patterns or pending lessons — 3 to 4 honest and compassionate sentences.",
  "arquetipo": "The archetype that represents this soul — name the archetype and explain it in 2 to 3 sentences.",
  "mensaje": "A direct and intimate message from the Record for this person — 2 to 3 sentences that could only be for them."
}`;

  const response = await fetch(`${API}/api/akashic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error('Could not open the Record');
  return response.json();
}

const COLORS = [
  "#FF6B6B","#FFB347","#FFD93D","#6BCB77","#4D96FF","#C77DFF","#FF85A1","#00C9A7"
];

function Avatar({ name, color, foto, size = 48 }) {
  if (foto) return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
      <img src={foto} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontWeight: 700, color: "#1a1a2e", flexShrink: 0,
      fontFamily: "'Playfair Display', serif"
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function Badge({ days }) {
  let bg, text;
  if (days === 0) { bg = "#FF6B6B"; text = "TODAY! 🎉"; }
  else if (days <= 7) { bg = "#FFB347"; text = `${days}d`; }
  else if (days <= 30) { bg = "#FFD93D"; text = `${days}d`; }
  else { bg = "#2d2d4e"; text = `${days}d`; }
  return (
    <span style={{
      background: bg, color: days === 0 ? "#fff" : days <= 30 ? "#1a1a2e" : "#aaa",
      borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700,
      fontFamily: "monospace", whiteSpace: "nowrap"
    }}>{text}</span>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(localStorage.getItem('usuario') || '');
  const [loginForm, setLoginForm] = useState({ usuario: '', password: '' });
  const [authMode, setAuthMode] = useState("login");
  const [personas, setPersonas] = useState([]);
  const [view, setView] = useState("lista");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ nombre: "", apodo: "", fecha: "", gustos: "", notas: "", foto: "", fotoPos: "50% 50%" });
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [capsula, setCapsula] = useState(null);
  const [capsulaLoading, setCapsulaLoading] = useState(false);
  const [capsulaError, setCapsulaError] = useState(null);
  const [tonali, setTonali] = useState(null);
  const [tonaliVisible, setTonaliVisible] = useState(false);
  const [akashic, setAkashic] = useState(null);
  const [akashicLoading, setAkashicLoading] = useState(false);
  const [akashicError, setAkashicError] = useState(null);
  const [showAuthor, setShowAuthor] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    fetch(`${API}/personas`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (r.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          setToken(''); setUsuario(''); setLoggedIn(false);
          return null;
        }
        return r.json();
      })
      .then(data => {
        if (data) setPersonas(data.map(p => ({ ...p, fecha: p.fecha.split("T")[0] })));
      })
      .catch(err => console.error(err));
  }, [loggedIn, token]);

  const sorted = [...personas]
    .filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))
    .map(p => ({ ...p, days: getDaysUntilBirthday(p.fecha) }))
    .sort((a, b) => a.days - b.days);

  const upcoming = sorted.filter(p => p.days <= 30);

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.fecha) return;
    try {
      const endpoint = editId !== null ? `${API}/personas/${editId}` : `${API}/personas`;
      const method = editId !== null ? "PUT" : "POST";
      const body = editId !== null ? form : { ...form, color: COLORS[personas.length % COLORS.length] };
      const r = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await r.json();
      const fechaLimpia = data.fecha ? data.fecha.substring(0, 10) : form.fecha;
      const persona = { ...data, fecha: fechaLimpia };
      if (editId !== null) {
        setPersonas(personas.map(p => p.id === editId ? persona : p));
        setEditId(null);
      } else {
        setPersonas([...personas, persona]);
      }
      setForm({ nombre: "", apodo: "", fecha: "", gustos: "", notas: "", foto: "", fotoPos: "50% 50%" });
      setView("lista");
    } catch(err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/personas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setPersonas(personas.filter(p => p.id !== id));
    setView("lista");
    setSelected(null);
  };

  const handleEdit = (p) => {
    setForm({ nombre: p.nombre, apodo: p.apodo || "", fecha: p.fecha, gustos: p.gustos || "", notas: p.notas || "", foto: p.foto || "", fotoPos: p.fotoPos || "50% 50%" });
    setEditId(p.id);
    setView("form");
  };

  const handleDescubrirDia = async (persona) => {
    setCapsula(null);
    setCapsulaError(null);
    setCapsulaLoading(true);
    try {
      if (persona.capsula) {
        setCapsula(JSON.parse(persona.capsula));
        setCapsulaLoading(false);
        return;
      }
      const data = await fetchCapsula(token, persona.nombre, persona.fecha);
      await fetch(`${API}/personas/${persona.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...persona, capsula: JSON.stringify(data) })
      });
      setPersonas(personas.map(p => p.id === persona.id ? { ...p, capsula: JSON.stringify(data) } : p));
      setCapsula(data);
    } catch (e) {
      setCapsulaError("Could not load the time capsule. Please try again.");
    }
    setCapsulaLoading(false);
  };

  const handleMostrarTonali = (persona) => {
    const resultado = calcularTonali(persona.fecha);
    setTonali(resultado);
    setTonaliVisible(true);
  };

  const handleLecturaAlma = async (persona) => {
    setAkashic(null);
    setAkashicError(null);
    setAkashicLoading(true);
    try {
      if (persona.akashic) {
        setAkashic(JSON.parse(persona.akashic));
        setAkashicLoading(false);
        return;
      }
      const lectura = await fetchAkashic(token, persona);
      await fetch(`${API}/personas/${persona.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...persona, akashic: JSON.stringify(lectura) })
      });
      setPersonas(personas.map(p => p.id === persona.id ? { ...p, akashic: JSON.stringify(lectura) } : p));
      setAkashic(lectura);
    } catch (e) {
      console.error(e);
      setAkashicError("Could not open the Record. Please try again.");
    }
    setAkashicLoading(false);
  };

  const persona = selected ? personas.find(p => p.id === selected) : null;

  if (!loggedIn) return (
    <div style={{
      minHeight: "100vh", background: "#0f0f1e",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      <div style={{ background: "#1a1a2e", borderRadius: 20, padding: 32, width: 300, border: "1px solid #2a2a4e" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 40 }}>🏛️</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#fff", marginTop: 8 }}>
            The Vault of Chronos
          </div>
          <div style={{ display: "flex", marginTop: 16, background: "#0f0f1e", borderRadius: 10, padding: 4 }}>
            {["login", "register"].map(mode => (
              <button key={mode} onClick={() => setAuthMode(mode)} style={{
                flex: 1, padding: "8px 0", border: "none", borderRadius: 8, cursor: "pointer",
                background: authMode === mode ? "linear-gradient(135deg, #6C63FF, #FF6B9D)" : "transparent",
                color: authMode === mode ? "#fff" : "#6666aa", fontWeight: 700, fontSize: 13
              }}>
                {mode === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
        </div>
        {["usuario", "password"].map(f => (
          <div key={f} style={{ marginBottom: 14 }}>
            <input
              type={f === "password" ? "password" : "text"}
              placeholder={f === "usuario" ? "Username" : "Password"}
              value={loginForm[f]}
              onChange={e => setLoginForm(l => ({ ...l, [f]: e.target.value }))}
              style={{
                width: "100%", background: "#0f0f1e", border: "1px solid #2a2a4e",
                borderRadius: 10, padding: "12px 14px", color: "#e8e8f0",
                fontSize: 14, boxSizing: "border-box", outline: "none"
              }}
            />
          </div>
        ))}
        <button onClick={async () => {
          const endpoint = authMode === "login" ? "/login" : "/register";
          const r = await fetch(`${API}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginForm)
          });
          const data = await r.json();
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', data.usuario);
            setToken(data.token);
            setUsuario(data.usuario);
            setLoggedIn(true);
          } else {
            alert(data.error || "Error processing request");
          }
        }} style={{
          width: "100%", background: "linear-gradient(135deg, #6C63FF, #FF6B9D)",
          border: "none", borderRadius: 12, padding: 14,
          color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer"
        }}>
          {authMode === "login" ? "Enter 🔐" : "Create Account ✨"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f1e",
      fontFamily: "'DM Sans', sans-serif", color: "#e8e8f0",
      maxWidth: 480, margin: "0 auto", position: "relative"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      <style>{`
        @media print {
          body { background: #fff !important; color: #111 !important; }
          .no-print { display: none !important; }
          .print-card { background: #fff !important; color: #111 !important; border: 1px solid #ddd !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          button { display: none !important; }
          a { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="no-print" style={{
        padding: "24px 20px 12px", background: "linear-gradient(135deg, #1a1a3e 0%, #0f0f1e 100%)",
        borderBottom: "1px solid #2a2a4e"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#fff" }}>
              🏛️ The Vault of Chronos
            </div>
            <div style={{ fontSize: 12, color: "#6666aa", marginTop: 2 }}>
              <span onClick={() => setShowAuthor(true)} style={{ cursor: "pointer", color: "#00C9A7", fontWeight: 700 }}>-=ArtMoreno=-</span>
              {' '}· 👤 {usuario} · {personas.length} {personas.length === 1 ? "person" : "people"} saved
            </div>
          </div>
          <button onClick={() => {
            localStorage.removeItem('token'); localStorage.removeItem('usuario');
            setToken(''); setUsuario(''); setLoggedIn(false); setPersonas([]);
          }} style={{
            background: "rgba(255,107,107,0.15)", border: "1px solid #FF6B6B44",
            borderRadius: 10, padding: "6px 12px", color: "#FF6B6B",
            fontSize: 12, fontWeight: 700, cursor: "pointer", marginRight: 8
          }}>Sign Out</button>
          <button onClick={() => { setForm({ nombre: "", fecha: "", gustos: "", notas: "" }); setEditId(null); setView("form"); }}
            style={{
              background: "linear-gradient(135deg, #6C63FF, #FF6B9D)",
              border: "none", borderRadius: 14, width: 44, height: 44,
              color: "#fff", fontSize: 22, cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center"
            }}>+</button>
        </div>
        {upcoming.length > 0 && view === "lista" && (
          <div style={{ marginTop: 16, background: "#1a1a3e", borderRadius: 12, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "#6C63FF", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>NEXT 30 DAYS</div>
            {upcoming.slice(0,3).map(p => (
              <div key={p.id} onClick={() => { setSelected(p.id); setView("detalle"); setCapsula(null); setTonali(null); setTonaliVisible(false); setAkashic(null); setAkashicError(null); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", cursor: "pointer" }}>
                <Avatar name={p.nombre} color={p.color} foto={p.foto} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.nombre}</div>
                  <div style={{ fontSize: 11, color: "#6666aa" }}>{zodiacSign(p.fecha)}</div>
                </div>
                <Badge days={p.days} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* List view */}
      {view === "lista" && (
        <div style={{ padding: "16px 20px" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search person..."
            style={{
              width: "100%", background: "#1a1a2e", border: "1px solid #2a2a4e",
              borderRadius: 10, padding: "10px 14px", color: "#e8e8f0",
              fontSize: 14, marginBottom: 16, boxSizing: "border-box", outline: "none"
            }}
          />
          {sorted.length === 0 && (
            <div style={{ textAlign: "center", color: "#444", marginTop: 60 }}>
              <div style={{ fontSize: 48 }}>🎈</div>
              <div style={{ marginTop: 12, fontSize: 14 }}>Add your first person</div>
            </div>
          )}
          {sorted.map(p => (
            <div key={p.id} onClick={() => { setSelected(p.id); setView("detalle"); setCapsula(null); setTonali(null); setTonaliVisible(false); setAkashic(null); setAkashicError(null); }}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "#1a1a2e", borderRadius: 14, padding: "14px",
                marginBottom: 10, cursor: "pointer", border: "1px solid #2a2a3e"
              }}>
              <Avatar name={p.nombre} color={p.color} foto={p.foto} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nombre}</div>
                <div style={{ fontSize: 12, color: "#6666aa", marginTop: 2 }}>
                  {(() => { const p2 = p.fecha.split("-"); return `${p2[1]}/${p2[2]}/${p2[0]}`; })()} · {zodiacSign(p.fecha)}
                </div>
              </div>
              <Badge days={p.days} />
            </div>
          ))}
        </div>
      )}

      {/* Form view */}
      {view === "form" && (
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <button onClick={() => setView("lista")} style={{ background: "none", border: "none", color: "#6C63FF", fontSize: 20, cursor: "pointer" }}>←</button>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>
              {editId ? "Edit person" : "New person"}
            </div>
          </div>
          {[
            { label: "Name *", key: "nombre", placeholder: "What's their name?" },
            { label: "Nickname", key: "apodo", placeholder: "E.g.: Johnny, Lizzie, Mike..." },
            { label: "Interests / Hobbies", key: "gustos", placeholder: "Coffee, music, books..." },
            { label: "Notes", key: "notas", placeholder: "Anything you want to remember..." },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#6666aa", fontWeight: 600, marginBottom: 6, letterSpacing: 0.5 }}>{f.label}</div>
              <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                type="text" placeholder={f.placeholder}
                style={{
                  width: "100%", background: "#1a1a2e", border: "1px solid #2a2a4e",
                  borderRadius: 10, padding: "12px 14px", color: "#e8e8f0",
                  fontSize: 14, boxSizing: "border-box", outline: "none"
                }}
              />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#6666aa", fontWeight: 600, marginBottom: 6, letterSpacing: 0.5 }}>Date of birth *</div>
            <input type="date" value={form.fecha}
              onChange={e => {
                const val = e.target.value;
                const match = val.match(/(\d{4})-(\d{2})-(\d{2})/);
                if (match) setForm({ ...form, fecha: `${match[1]}-${match[2]}-${match[3]}` });
                else setForm({ ...form, fecha: val });
              }}
              style={{
                width: "100%", background: "#1a1a2e", border: "1px solid #2a2a4e",
                borderRadius: 10, padding: "12px 14px", color: "#e8e8f0",
                fontSize: 14, boxSizing: "border-box", outline: "none",
                WebkitAppearance: "none", appearance: "none"
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#6666aa", fontWeight: 600, marginBottom: 6, letterSpacing: 0.5 }}>Photo (optional)</div>
            <label style={{
              display: "flex", alignItems: "center", gap: 12, background: "#1a1a2e",
              border: "1px dashed #2a2a4e", borderRadius: 10, padding: "12px 14px", cursor: "pointer"
            }}>
              {form.foto
                ? <img src={form.foto} alt="preview" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                : <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#2a2a4e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📷</div>
              }
              <span style={{ fontSize: 13, color: "#6666aa" }}>{form.foto ? "Change photo" : "Upload photo"}</span>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => {
                  const img = new Image();
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxSize = 400;
                    let w = img.width, h = img.height;
                    if (w > h && w > maxSize) { h = (h * maxSize) / w; w = maxSize; }
                    else if (h > maxSize) { w = (w * maxSize) / h; h = maxSize; }
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    setForm(f => ({ ...f, foto: canvas.toDataURL('image/jpeg', 0.7) }));
                  };
                  img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
              }} />
            </label>
            {form.foto && <button onClick={() => setForm(f => ({ ...f, foto: "" }))}
              style={{ marginTop: 6, background: "none", border: "none", color: "#FF6B6B", fontSize: 12, cursor: "pointer" }}>
              × Remove photo
            </button>}
          </div>
          <button onClick={handleSubmit} style={{
            width: "100%", background: "linear-gradient(135deg, #6C63FF, #FF6B9D)",
            border: "none", borderRadius: 12, padding: "14px",
            color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8
          }}>
            {editId ? "Save changes" : "Add person"} ✔
          </button>
        </div>
      )}

      {/* Detail view */}
      {view === "detalle" && persona && (() => {
        const days = getDaysUntilBirthday(persona.fecha);
        const parts = persona.fecha.split("-");
        const d = parts[2], m = parts[1], y = parts[0];
        const currentAge = getAge(persona.fecha);
        const nextAge = getAgeOnNextBirthday(persona.fecha);
        const signoNombre = getZodiacName(persona.fecha);
        const zodiacData = ZODIAC_DATA[signoNombre];

        const handleDrag = (e) => {
          if (!persona.foto) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const clientY = e.touches ? e.touches[0].clientY : e.clientY;
          const x = Math.round(((clientX - rect.left) / rect.width) * 100);
          const yy = Math.round(((clientY - rect.top) / rect.height) * 100);
          const clamped = `${Math.min(100,Math.max(0,x))}% ${Math.min(100,Math.max(0,yy))}%`;
          setPersonas(personas.map(p => p.id === persona.id ? { ...p, fotoPos: clamped } : p));
          fetch(`${API}/personas/${persona.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ...persona, fotoPos: clamped })
          });
        };

        return (
          <div>
            <div style={{ position: "relative", height: 280, overflow: "hidden", cursor: persona.foto ? "crosshair" : "default",
              background: persona.foto ? "none" : `linear-gradient(135deg, ${persona.color}55, #1a1a2e)` }}
              onClick={handleDrag} onTouchEnd={handleDrag}>
              {persona.foto && (
                <img src={persona.foto} alt={persona.nombre} style={{
                  width: "100%", height: "100%", objectFit: "cover", display: "block",
                  objectPosition: persona.fotoPos || "50% 50%", pointerEvents: "none", userSelect: "none"
                }} />
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(15,15,30,0.92) 100%)", pointerEvents: "none" }} />
              <button onClick={e => { e.stopPropagation(); setView("lista"); }} style={{
                position: "absolute", top: 16, left: 16, background: "rgba(0,0,0,0.55)",
                border: "none", borderRadius: 10, color: "#fff", fontSize: 18,
                cursor: "pointer", padding: "6px 14px", backdropFilter: "blur(4px)", zIndex: 2
              }}>←</button>
              {persona.foto && (
                <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.5)", borderRadius: 8, padding: "4px 8px", fontSize: 10, color: "#aaa", backdropFilter: "blur(4px)" }}>
                  👆 tap to reframe
                </div>
              )}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 20px 20px" }}>
                <div style={{ background: "rgba(15,15,30,0.78)", backdropFilter: "blur(10px)", borderRadius: 16, padding: "16px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#fff" }}>{persona.nombre}</div>
                  {persona.apodo && <div style={{ fontSize: 14, color: persona.color, fontWeight: 600, marginTop: 2 }}>"{persona.apodo}"</div>}
                  <div style={{ fontSize: 12, color: "#888", marginTop: 6, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span>{zodiacSign(persona.fecha)}</span>
                    <span style={{ color: "#333" }}>·</span>
                    <span>📅 {m}/{d}/{y}</span>
                    {currentAge && <><span style={{ color: "#333" }}>·</span><span style={{ color: persona.color, fontWeight: 700 }}>{currentAge} years old</span></>}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 20px" }}>
              {/* Birthday countdown */}
              <div style={{ background: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12, textAlign: "center" }}>
                {days === 0
                  ? <>
                      <div style={{ fontSize: 20, color: "#FF6B6B", fontWeight: 700 }}>🎉 Today is their birthday!</div>
                      {nextAge && <div style={{ fontSize: 15, color: "#FFB347", marginTop: 6 }}>Turning <b>{nextAge}</b> today! {nextAge >= 60 ? "👴 getting up there" : nextAge >= 40 ? "🙂 aging like fine wine" : "🎈"}</div>}
                    </>
                  : <>
                      <div style={{ fontSize: 36, fontWeight: 700, color: "#6C63FF", fontFamily: "'Playfair Display', serif" }}>{days}</div>
                      <div style={{ fontSize: 13, color: "#6666aa" }}>days until their birthday</div>
                      {nextAge && <div style={{ fontSize: 14, color: "#FFB347", marginTop: 8 }}>Will turn <b>{nextAge}</b> {nextAge >= 60 ? "👴 wise and seasoned" : nextAge >= 40 ? "🙂" : "🎈"}</div>}
                      {currentAge && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Currently {currentAge} years old</div>}
                    </>
                }
                <div style={{ fontSize: 13, color: "#aaa", marginTop: 8 }}>📅 {m}/{d}/{y}</div>
              </div>

              {/* Life counter */}
              {currentAge !== null && (() => {
                const birthDate = new Date(persona.fecha);
                const now = new Date();
                const totalSeconds = Math.floor((now - birthDate) / 1000);
                const totalMinutes = Math.floor(totalSeconds / 60);
                const totalHours = Math.floor(totalMinutes / 60);
                const totalDays = Math.floor(totalHours / 24);
                const totalWeeks = Math.floor(totalDays / 7);
                const totalMonths = currentAge * 12 + (now.getMonth() - birthDate.getMonth() + (now.getDate() >= birthDate.getDate() ? 0 : -1));
                const fmt = n => n.toLocaleString("en-US");
                return (
                  <div style={{ background: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: "#00C9A7", fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>⏳ LIFE COUNTER</div>
                    <div style={{ fontSize: 13, color: "#aaa", marginBottom: 10, lineHeight: 1.7 }}>
                      <b style={{color:"#e8e8f0"}}>{persona.nombre.split(" ")[0]}</b> has been on this planet for <b style={{color:"#FFD93D"}}>{currentAge} years</b>, which is:
                    </div>
                    {[
                      { label: "Months", value: fmt(totalMonths), icon: "🗓️", color: "#FF6B6B" },
                      { label: "Weeks", value: fmt(totalWeeks), icon: "📆", color: "#FFB347" },
                      { label: "Days", value: fmt(totalDays), icon: "☀️", color: "#FFD93D" },
                      { label: "Hours", value: fmt(totalHours), icon: "⏰", color: "#6C63FF" },
                      { label: "Minutes", value: fmt(totalMinutes), icon: "⚡", color: "#C77DFF" },
                      { label: "Seconds", value: fmt(totalSeconds), icon: "💓", color: "#FF85A1" },
                    ].map((item, i) => (
                      <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 5 ? "1px solid #2a2a3e" : "none" }}>
                        <span style={{ fontSize: 13, color: "#aaa" }}>{item.icon} {item.label}</span>
                        <span style={{ fontSize: i >= 4 ? 13 : 16, fontWeight: 700, color: item.color, fontFamily: "monospace" }}>{item.value}</span>
                      </div>
                    ))}
                    <div style={{ fontSize: 11, color: "#444", marginTop: 10, textAlign: "center" }}>...and counting 💓</div>
                  </div>
                );
              })()}

              {/* Time Capsule */}
              <div style={{ background: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#FFD93D", fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>🌍 TIME CAPSULE — THE DAY YOU ARRIVED IN THE WORLD</div>
                {!capsula && !capsulaLoading && (
                  <button onClick={() => handleDescubrirDia(persona)} style={{
                    width: "100%", background: "linear-gradient(135deg, #FFD93D22, #FF6B6B22)",
                    border: "1px solid #FFD93D55", borderRadius: 10, padding: "12px",
                    color: "#FFD93D", fontSize: 14, fontWeight: 700, cursor: "pointer"
                  }}>✨ What was happening the day you were born? ✨</button>
                )}
                {capsulaLoading && (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "#6666aa", fontSize: 13 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🔮</div>Traveling through time...
                  </div>
                )}
                {capsulaError && (
                  <div style={{ color: "#FF6B6B", fontSize: 13, textAlign: "center" }}>
                    {capsulaError}
                    <button onClick={() => handleDescubrirDia(persona)} style={{ display: "block", margin: "8px auto 0", background: "none", border: "none", color: "#6C63FF", cursor: "pointer", fontSize: 13 }}>Try again</button>
                  </div>
                )}
                {capsula && (
                  <div>
                    {[
                      { icon: "📰", label: "Historical event", value: capsula.evento1, color: "#FF6B6B" },
                      { icon: "📰", label: "Another event", value: capsula.evento2, color: "#FF8E8E" },
                      { icon: "🌙", label: "Moon phase", value: capsula.luna, color: "#C77DFF" },
                      { icon: "🎵", label: "Music of the era", value: capsula.musica1, color: "#00C9A7" },
                      { icon: "🎶", label: "More music", value: capsula.musica2, color: "#00E5BC" },
                      { icon: "📺", label: "On TV / at the movies", value: capsula.entretenimiento1, color: "#4D96FF" },
                      { icon: "🎬", label: "More entertainment", value: capsula.entretenimiento2, color: "#7BB8FF" },
                      { icon: "⚽", label: "Sports", value: capsula.deporte1, color: "#6BCB77" },
                      { icon: "🏀", label: "More sports", value: capsula.deporte2, color: "#8FE09A" },
                      { icon: "💰", label: "Prices back then", value: capsula.precio, color: "#FFD93D" },
                      { icon: "💡", label: "Fun fact", value: capsula.dato_curioso, color: "#FFB347" },
                      { icon: "🌟", label: "Something you could try", value: capsula.recomendacion, color: "#FF85A1" },
                    ].map((item, i) => (
                      <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < 11 ? "1px solid #2a2a3e" : "none" }}>
                        <div style={{ fontSize: 11, color: item.color, fontWeight: 700, marginBottom: 4 }}>{item.icon} {item.label.toUpperCase()}</div>
                        <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{item.value}</div>
                      </div>
                    ))}
                    <button onClick={() => setCapsula(null)} style={{ background: "none", border: "none", color: "#444", fontSize: 11, cursor: "pointer", marginTop: 4 }}>× Close</button>
                  </div>
                )}
              </div>

              {/* Tonali Mexica */}
              <div style={{ background: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#FFB347", fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>🦅 TÓNALI — MEXICA CALENDAR 🦅</div>
                {!tonaliVisible && (
                  <button onClick={() => handleMostrarTonali(persona)} style={{
                    width: "100%", background: "linear-gradient(135deg, #B8860B22, #FFB34722)",
                    border: "1px solid #FFB34755", borderRadius: 10, padding: "12px",
                    color: "#FFB347", fontSize: 14, fontWeight: 700, cursor: "pointer"
                  }}>🌀 Discover my Mexica sign 🌀</button>
                )}
                {tonaliVisible && tonali && (() => {
                  const { numero, signo, signoTrecena, señorNoche, señorDia, diaSolar, mesSolar, numAño, signoAño } = tonali;
                  const mismoSigno = signo.nombre === signoTrecena.nombre;
                  const esPrimerDia = numero === 1;

                  const descTrecena = esPrimerDia
                    ? `You were born exactly on the first day of the trecena — the day that gives the entire cycle its name. This is uncommon and very significant. The sign's energy manifests in you in its purest and most direct form.`
                    : `You are day ${numero} of this trecena. The energy of ${signoTrecena.nombre} colors your entire 13-day cycle.`;

                  return (
                    <div>
                      <div style={{ background: "linear-gradient(135deg, #2a1a0a, #1a1a2e)", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #B8860B44", textAlign: "center" }}>
                        <div style={{ fontSize: 44 }}>{signo.emoji}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: "#FFB347", fontFamily: "'Playfair Display', serif", marginTop: 4 }}>{numero} {signo.nombre}</div>
                        <div style={{ fontSize: 13, color: "#ccc", marginTop: 8, lineHeight: 1.7 }}>{signo.desc}</div>
                      </div>
                      {[
                        { color: "#FFD93D", label: "📅 TRECENA", title: `Ce (1) ${signoTrecena.nombre} · Day ${numero} of the cycle`, desc: descTrecena },
                        { color: "#C77DFF", label: "🌙 LORD OF THE NIGHT", title: señorNoche.nombre, desc: señorNoche.desc },
                        { color: "#FF6B6B", label: "🔥 LORD OF THE DAY", title: señorDia, desc: `Rules number ${numero} in the daily cycle.` },
                        { color: "#6BCB77", label: "📆 SOLAR MONTH · XIUHPOHUALLI", title: `Day ${diaSolar} of ${mesSolar.nombre}`, desc: mesSolar.desc },
                        { color: "#4D96FF", label: "🗓️ YEAR", title: `${numAño} ${signoAño.nombre} — ${signoAño.desc}`, desc: "" },
                      ].map((s, i) => (
                        <div key={i} style={{ background: "#0f0f1e", borderRadius: 10, padding: 14, marginBottom: 8, borderLeft: `3px solid ${s.color}` }}>
                          <div style={{ fontSize: 10, color: s.color, fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                          <div style={{ fontSize: 13, color: "#e8e8f0", fontWeight: 700, marginBottom: s.desc ? 6 : 0 }}>{s.title}</div>
                          {s.desc && <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>{s.desc}</div>}
                        </div>
                      ))}

                      {/* Personalized commentary */}
                      <div style={{ background: "linear-gradient(135deg, #1a1a2e, #0f0f1e)", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #6C63FF33", borderLeft: "3px solid #6C63FF" }}>
                        <div style={{ fontSize: 10, color: "#6C63FF", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>🌀 WHAT YOUR CALENDAR SAYS</div>
                        <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.8 }}>
                          {mismoSigno
                            ? `${persona.nombre.split(" ")[0]} carries an extraordinary mark: ${signo.nombre} appears in both the tónali and the trecena. In Mexica cosmovision, when elements align this way, it signals a clear mission and a strongly marked energy of destiny. The cosmos left no room for doubt. 🦅`
                            : `${persona.nombre.split(" ")[0]} was born under ${signo.nombre} — ${signo.desc} The Mexica calendar does not assign signs randomly: each combination speaks of a unique energy that accompanies the person throughout their entire life.`
                          }
                          {esPrimerDia && !mismoSigno ? ` And there's something more: born exactly on day 1 of the trecena — the starting point of the cycle. That gives the sign an unmixed, direct and powerful energy.` : ""}
                        </div>
                      </div>

                      <div style={{ background: "linear-gradient(135deg, #1a2a1a, #0f0f1e)", borderRadius: 10, padding: 16, marginTop: 4, border: "1px solid #2a4a2a", textAlign: "center" }}>
                        <div style={{ fontSize: 13, color: "#6BCB77", fontStyle: "italic", lineHeight: 1.8, marginBottom: 8 }}>
                          "Amo xichoka kana, se tonati niualas nimitsitaki,<br />ipan se yejyektsi uitsitsili nimokuaptos."
                        </div>
                        <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.7, marginBottom: 10 }}>
                          "Don't cry for me, one day I will come to see you,<br />transformed into a beautiful hummingbird." 🪶
                        </div>
                        <div style={{ fontSize: 10, color: "#00C9A7", letterSpacing: 1, cursor: "pointer", fontWeight: 700 }} onClick={() => setShowAuthor(true)}>-=ArtMoreno=-</div>
                      </div>
                      <button onClick={() => setTonaliVisible(false)} style={{ background: "none", border: "none", color: "#444", fontSize: 11, cursor: "pointer", marginTop: 10 }}>× Close</button>
                    </div>
                  );
                })()}
              </div>

              {/* Zodiac */}
              {zodiacData && (
                <div style={{ background: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: "#C77DFF", fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>{zodiacData.emoji} ZODIAC SIGN · {signoNombre.toUpperCase()}</div>
                  <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6, marginBottom: 12 }}>{zodiacData.descripcion}</div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <div style={{ flex: 1, background: "#0f0f1e", borderRadius: 10, padding: 10 }}>
                      <div style={{ fontSize: 10, color: "#6BCB77", fontWeight: 700, marginBottom: 6 }}>💚 COMPATIBLE WITH</div>
                      {zodiacData.compatible.map(s => <div key={s} style={{ fontSize: 12, color: "#aaa", marginBottom: 2 }}>• {s}</div>)}
                    </div>
                    <div style={{ flex: 1, background: "#0f0f1e", borderRadius: 10, padding: 10 }}>
                      <div style={{ fontSize: 10, color: "#FF6B6B", fontWeight: 700, marginBottom: 6 }}>🚫 BETTER AVOID</div>
                      {zodiacData.evitar.map(s => <div key={s} style={{ fontSize: 12, color: "#aaa", marginBottom: 2 }}>• {s}</div>)}
                    </div>
                  </div>
                  <div style={{ background: "#0f0f1e", borderRadius: 10, padding: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: "#FFD93D", fontWeight: 700, marginBottom: 4 }}>⚡ STRENGTH</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{zodiacData.fortaleza}</div>
                  </div>
                  <div style={{ background: "#0f0f1e", borderRadius: 10, padding: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: "#FF6B6B", fontWeight: 700, marginBottom: 4 }}>😅 WEAKNESS</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{zodiacData.debilidad}</div>
                  </div>
                  <div style={{ background: "#2a1a3e", borderRadius: 10, padding: 10, borderLeft: "3px solid #C77DFF" }}>
                    <div style={{ fontSize: 10, color: "#C77DFF", fontWeight: 700, marginBottom: 4 }}>💬 PRO TIP</div>
                    <div style={{ fontSize: 12, color: "#ddd", fontStyle: "italic" }}>{zodiacData.consejo}</div>
                  </div>
                </div>
              )}

              {/* Akashic Records */}
              <div style={{ background: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#00C9A7", fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>🌌 SOUL READING — AKASHIC RECORDS 🌌</div>
                {!akashic && !akashicLoading && (
                  <button onClick={() => handleLecturaAlma(persona)} style={{
                    width: "100%", background: "linear-gradient(135deg, #00C9A722, #6C63FF22)",
                    border: "1px solid #00C9A755", borderRadius: 10, padding: "12px",
                    color: "#00C9A7", fontSize: 14, fontWeight: 700, cursor: "pointer"
                  }}>🌌 Open my Akashic Record 🌌</button>
                )}
                {akashicLoading && (
                  <div style={{ textAlign: "center", padding: "24px 0", color: "#6666aa", fontSize: 13 }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>🌌</div>
                    <div style={{ color: "#00C9A7", fontWeight: 600, marginBottom: 4 }}>Accessing the Record...</div>
                    <div style={{ fontSize: 11, color: "#444" }}>This may take a moment</div>
                  </div>
                )}
                {akashicError && (
                  <div style={{ color: "#FF6B6B", fontSize: 13, textAlign: "center" }}>
                    {akashicError}
                    <button onClick={() => handleLecturaAlma(persona)} style={{ display: "block", margin: "8px auto 0", background: "none", border: "none", color: "#6C63FF", cursor: "pointer", fontSize: 13 }}>Try again</button>
                  </div>
                )}
                {akashic && (() => {
                  const secciones = [
                    { key: "proposito", icon: "🌟", label: "SOUL'S PURPOSE", color: "#00C9A7" },
                    { key: "dones", icon: "✨", label: "GIFTS FROM PAST LIVES", color: "#FFD93D" },
                    { key: "karma", icon: "🔄", label: "KARMIC PATTERNS", color: "#FF6B6B" },
                    { key: "arquetipo", icon: "🦅", label: "SOUL ARCHETYPE", color: "#C77DFF" },
                    { key: "mensaje", icon: "🪶", label: "MESSAGE FROM THE RECORD", color: "#6BCB77" },
                  ];
                  return (
                    <div>
                      {secciones.map((s, i) => akashic[s.key] && (
                        <div key={i} style={{ background: "#0f0f1e", borderRadius: 10, padding: 14, marginBottom: 10, borderLeft: `3px solid ${s.color}` }}>
                          <div style={{ fontSize: 10, color: s.color, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>{s.icon} {s.label}</div>
                          <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.8 }}>
                            {s.key === "mensaje" ? <em style={{ color: "#aaa" }}>"{akashic[s.key]}"</em> : akashic[s.key]}
                          </div>
                        </div>
                      ))}
                      <button onClick={() => setAkashic(null)} style={{ background: "none", border: "none", color: "#444", fontSize: 11, cursor: "pointer", marginTop: 8 }}>× Close</button>
                    </div>
                  );
                })()}
              </div>

              {persona.gustos && (
                <div style={{ background: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: "#FFB347", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>🎁 INTERESTS / GIFT IDEAS</div>
                  <div style={{ fontSize: 14, lineHeight: 1.6 }}>{persona.gustos}</div>
                </div>
              )}

              {persona.notas && (
                <div style={{ background: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: "#6C63FF", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>📝 NOTES</div>
                  <div style={{ fontSize: 14, lineHeight: 1.6 }}>{persona.notas}</div>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 20 }} className="no-print">
                <button onClick={() => handleEdit(persona)} style={{ flex: 1, background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 12, padding: 12, color: "#6C63FF", fontWeight: 700, cursor: "pointer" }}>✏️ Edit</button>
                <button onClick={() => { if (window.confirm("Delete " + persona.nombre + "?")) handleDelete(persona.id); }}
                  style={{ flex: 1, background: "#1a1a2e", border: "1px solid #3a1a1a", borderRadius: 12, padding: 12, color: "#FF6B6B", fontWeight: 700, cursor: "pointer" }}>🗑️ Delete</button>
              </div>

              <button className="no-print" onClick={() => window.print()} style={{
                width: "100%", marginTop: 10,
                background: "linear-gradient(135deg, #1a2a1a, #0f1f0f)",
                border: "1px solid #6BCB7755", borderRadius: 12, padding: 14,
                color: "#6BCB77", fontSize: 14, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}>🖨️ Print / Save as PDF</button>
            </div>
          </div>
        );
      })()}

      {/* Author modal */}
      {showAuthor && (
        <div onClick={() => setShowAuthor(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(135deg, #1a1a2e, #0f0f1e)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 340, border: "1px solid #00C9A733", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px", background: "linear-gradient(135deg, #00C9A7, #6C63FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🦅</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}>-=ArtMoreno=-</div>
            <div style={{ fontSize: 12, color: "#6666aa", marginBottom: 20 }}>Creator of The Vault of Chronos</div>
            <div style={{ background: "#0f0f1e", borderRadius: 12, padding: 14, marginBottom: 20, border: "1px solid #00C9A722" }}>
              <div style={{ fontSize: 11, color: "#00C9A7", fontStyle: "italic", lineHeight: 1.7 }}>"Awakening is not what you expected..."</div>
            </div>
            <a href="mailto:despertarnoescomoloesperabas@gmail.com" style={{ display: "block", textDecoration: "none", background: "linear-gradient(135deg, #00C9A7, #6C63FF)", borderRadius: 12, padding: "14px", color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
              ✉️ despertarnoescomoloesperabas@gmail.com
            </a>
            <button onClick={() => setShowAuthor(false)} style={{ background: "none", border: "none", color: "#444", fontSize: 12, cursor: "pointer", marginTop: 4 }}>× Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
