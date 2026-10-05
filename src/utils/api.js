// Cliente del backend real de Josse Music.
//
// En este entorno de edición (vista previa), Vite hace proxy de /api hacia el
// servidor Express que corre internamente en el mismo contenedor (puerto 4000).
// La vista previa se sirve bajo una sub-ruta (BASE_URL), así que las llamadas se
// construyen relativas a esa base, nunca como "/api" absoluto.
//
// En el SITIO PUBLICADO (estático) no existe ese backend interno: hay que
// desplegarlo por separado (ver server/README.md, recomendado Render.com) y
// apuntar aquí a su URL pública, vía la variable de entorno VITE_API_URL
// definida al momento de publicar, o fijando PRODUCTION_API_URL abajo.
const PRODUCTION_API_URL = ""; // ej: "https://josse-music-api.onrender.com"

const configuredBase = import.meta.env.VITE_API_URL || PRODUCTION_API_URL;

const API_BASE = configuredBase
  ? `${configuredBase.replace(/[/]$/, "")}/api`
  : `${import.meta.env.BASE_URL.replace(/[/]$/, "")}/api`;
const TOKEN_KEY = "josse_admin_token";

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function parseOrThrow(res) {
  let data = null;
  try {
    data = await res.json();
  } catch {
    // respuesta sin cuerpo JSON (ej. imagen)
  }
  if (!res.ok) {
    const msg = (data && data.error) || "Something went wrong, please try again";
    throw new Error(msg);
  }
  return data;
}

export async function createOrder({ trackId, trackTitle, price, nombre, email, txHash, file }) {
  const fd = new FormData();
  fd.append("trackId", trackId);
  fd.append("trackTitle", trackTitle);
  fd.append("price", price);
  fd.append("nombre", nombre);
  fd.append("email", email);
  fd.append("txHash", txHash || "");
  fd.append("proof", file);

  const res = await fetch(`${API_BASE}/orders`, { method: "POST", body: fd });
  return parseOrThrow(res);
}

export async function fetchOrder(id) {
  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id.trim().toUpperCase())}`);
  return parseOrThrow(res);
}

export async function adminLogin(password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await parseOrThrow(res);
  setAdminToken(data.token);
  return data;
}

export async function fetchAdminOrders() {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    clearAdminToken();
  }
  return parseOrThrow(res);
}

export async function confirmOrder(id, downloadLink) {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: "confirmed", downloadLink }),
  });
  return parseOrThrow(res);
}

export async function revertOrder(id) {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: "pending" }),
  });
  return parseOrThrow(res);
}

export function proofUrl(id) {
  const token = getAdminToken();
  return `${API_BASE}/admin/orders/${id}/proof?token=${encodeURIComponent(token || "")}`;
}
