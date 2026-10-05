import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const PORT = process.env.PORT || 4000;
// HOST: en este entorno de edición debe quedarse en 127.0.0.1 (solo Vite lo alcanza
// internamente vía proxy). Al desplegar en un servicio real como Render, se debe
// configurar HOST=0.0.0.0 (ver server/README.md) para que sea accesible públicamente.
const HOST = process.env.HOST || "127.0.0.1";
const JWT_SECRET = process.env.JWT_SECRET || "josse-music-dev-secret-change-me";
// La contraseña real del administrador vive en server/.env (ADMIN_PASSWORD).
// Nunca se guarda en el código del frontend ni se expone al navegador.
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "josse2024", 10);
// CORS_ORIGIN: en producción (backend desplegado por separado del sitio estático
// publicado) debe fijarse al dominio real del sitio, ej: https://tuartista.com
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const unique = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    cb(null, unique + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo se permiten imágenes"));
    }
    cb(null, true);
  },
});

function genOrderId() {
  return "JM-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.query.token;
  if (!token) return res.status(401).json({ error: "No autorizado." });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Sesión expirada, inicia sesión de nuevo." });
  }
}

// ---------- Público: crear pedido con comprobante ----------
app.post("/api/orders", upload.single("proof"), (req, res) => {
  try {
    const { trackId, trackTitle, price, nombre, email, txHash } = req.body;
    if (!nombre || !email || !trackId || !trackTitle || !req.file) {
      return res.status(400).json({ error: "Faltan datos obligatorios o el comprobante de pago." });
    }
    const id = genOrderId();
    db.prepare(
      `INSERT INTO orders (id, trackId, trackTitle, price, nombre, email, txHash, proofFilename, status, downloadLink, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', '', ?)`
    ).run(
      id,
      trackId,
      trackTitle,
      Number(price) || 0,
      nombre,
      email,
      txHash || "",
      req.file.filename,
      new Date().toISOString()
    );
    res.json({ ok: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo registrar el pedido. Intenta de nuevo." });
  }
});

// ---------- Público: consultar estado de un pedido ----------
app.get("/api/orders/:id", (req, res) => {
  const order = db
    .prepare(
      "SELECT id, trackTitle, price, status, downloadLink, createdAt FROM orders WHERE id = ?"
    )
    .get(req.params.id.trim().toUpperCase());
  if (!order) return res.status(404).json({ error: "No encontramos ese pedido." });
  res.json(order);
});

// ---------- Admin: login ----------
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body || {};
  if (!password || !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ error: "Contraseña incorrecta." });
  }
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token });
});

// ---------- Admin: listar pedidos ----------
app.get("/api/admin/orders", authMiddleware, (req, res) => {
  const orders = db.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all();
  res.json(
    orders.map((o) => ({
      ...o,
      hasProof: !!o.proofFilename,
    }))
  );
});

// ---------- Admin: ver imagen del comprobante (protegido) ----------
app.get("/api/admin/orders/:id/proof", authMiddleware, (req, res) => {
  const order = db.prepare("SELECT proofFilename FROM orders WHERE id = ?").get(req.params.id);
  if (!order || !order.proofFilename) return res.status(404).send("No encontrado");
  const filePath = path.join(uploadsDir, order.proofFilename);
  if (!fs.existsSync(filePath)) return res.status(404).send("No encontrado");
  res.sendFile(filePath);
});

// ---------- Admin: confirmar pago / asignar enlace de descarga ----------
app.patch("/api/admin/orders/:id", authMiddleware, (req, res) => {
  const { status, downloadLink } = req.body;
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
  if (!order) return res.status(404).json({ error: "Pedido no encontrado." });
  db.prepare("UPDATE orders SET status = ?, downloadLink = ? WHERE id = ?").run(
    status ?? order.status,
    downloadLink ?? order.downloadLink,
    req.params.id
  );
  res.json({ ok: true });
});

// En este entorno de edición, HOST queda en 127.0.0.1 (solo localhost): el backend
// nunca debe quedar expuesto como puerto público independiente aquí, porque la
// detección automática de puertos de la plataforma podía confundirlo con "el" puerto
// de la app y enrutar la vista previa ahí (mostrando el 404 de Express). Vite (5173,
// el único puerto público real en este entorno) lo alcanza internamente vía proxy.
// Al desplegar en un servicio real (Render, Railway, etc.) se configura HOST=0.0.0.0.
app.listen(PORT, HOST, () => {
  console.log(`Backend Josse Music escuchando en ${HOST}:${PORT}`);
});
