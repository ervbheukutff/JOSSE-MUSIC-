import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { FiCopy, FiCheck, FiUpload } from "react-icons/fi";
import { catalog } from "../data/catalog.js";
import { createOrder } from "../utils/api.js";

const WALLET_ADDRESS = "TQn9Y2khEsLMG3vqYyXW9Q2ZqZ8T6UktMj";

export default function Buy() {
  const location = useLocation();
  const preselected = location.state?.trackId || catalog[0].id;
  const [selectedId, setSelectedId] = useState(preselected);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", txHash: "" });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.trackId) setSelectedId(location.state.trackId);
  }, [location.state]);

  const selectedTrack = catalog.find((t) => t.id === selectedId) || catalog[0];

  const copyAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ ok: false, msg: "Por favor sube una imagen o captura del comprobante de pago." });
      return;
    }
    setLoading(true);
    try {
      const { id } = await createOrder({
        trackId: selectedTrack.id,
        trackTitle: selectedTrack.title,
        price: selectedTrack.price,
        nombre: form.nombre,
        email: form.email,
        txHash: form.txHash,
        file,
      });
      setOrderId(id);
      setStatus({
        ok: true,
        msg: `¡Comprobante recibido! Tu número de pedido es ${id}. Guárdalo: lo necesitarás en "Mi pedido" para ver el enlace de descarga una vez confirmemos el pago manualmente (normalmente en unas horas).`,
      });
      setForm({ nombre: "", email: "", txHash: "" });
      setFile(null);
      setFileName("");
    } catch (err) {
      setStatus({ ok: false, msg: err.message || "Something went wrong, please try again" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-hero">
        <p className="section-kicker">Compra directa</p>
        <h1>Apoya la música con USDT</h1>
        <p>
          Compra sencillos y álbumes pagando en USDT (red TRC20). Ideal para fans en Cuba: sin
          bancos, sin procesadores tradicionales, directo de fan a artista.
        </p>
      </div>

      <section className="section" style={{ paddingTop: "10px" }}>
        <div className="container buy-grid">
          <div>
            <h2 style={{ marginBottom: "18px", color: "var(--gold-soft)" }}>1. Elige tu música</h2>
            <div className="catalog-select">
              {catalog.map((t) => (
                <div
                  key={t.id}
                  className={`catalog-item ${selectedId === t.id ? "selected" : ""}`}
                  onClick={() => setSelectedId(t.id)}
                >
                  <span>
                    <span className="name">{t.title}</span>
                    <span className="type">
                      {t.type} · {t.year}
                    </span>
                  </span>
                  <span className="price">${t.price} USDT</span>
                </div>
              ))}
            </div>

            <h2 style={{ margin: "34px 0 18px", color: "var(--gold-soft)" }}>2. Paga en USDT (TRC20)</h2>
            <div className="wallet-box">
              <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
                Envía exactamente <strong className="gold-text">${selectedTrack.price} USDT</strong> a
                esta dirección en la red <strong>TRC20 (Tron)</strong>:
              </p>
              <div className="qr-frame">
                <QRCodeSVG value={WALLET_ADDRESS} size={170} />
              </div>
              <div className="wallet-address">{WALLET_ADDRESS}</div>
              <button className="btn small copy-btn" onClick={copyAddress}>
                {copied ? <FiCheck /> : <FiCopy />} {copied ? "Copiado" : "Copiar dirección"}
              </button>
              <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "14px" }}>
                Verifica siempre que la red seleccionada en tu wallet o exchange sea{" "}
                <strong>TRC20</strong>. Enviar por otra red puede causar pérdida de fondos.
              </p>
            </div>
          </div>

          <div>
            <h2 style={{ marginBottom: "18px", color: "var(--gold-soft)" }}>3. Sube tu comprobante</h2>
            <form className="form-box" onSubmit={handleSubmit}>
              <div className="field">
                <label>Música seleccionada</label>
                <input value={`${selectedTrack.title} — $${selectedTrack.price} USDT`} disabled />
              </div>
              <div className="field">
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  required
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="field">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Para enviarte el enlace de descarga"
                />
              </div>
              <div className="field">
                <label htmlFor="txHash">Hash de transacción (opcional)</label>
                <input
                  id="txHash"
                  name="txHash"
                  value={form.txHash}
                  onChange={handleChange}
                  placeholder="Ej: 8f3a1c..."
                />
              </div>
              <div className="field">
                <label>Comprobante de pago (captura de pantalla)</label>
                <label className={`file-drop ${fileName ? "has-file" : ""}`}>
                  <FiUpload style={{ marginRight: "6px" }} />
                  {fileName || "Haz clic para subir imagen del comprobante"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              <button
                type="submit"
                className="btn btn-solid"
                disabled={loading}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {loading ? "Enviando..." : "Enviar comprobante"}
              </button>
              {status && (
                <div className={`status-msg ${status.ok ? "ok" : "err"}`}>{status.msg}</div>
              )}
              {orderId && (
                <p style={{ marginTop: "10px", fontSize: "0.8rem", color: "var(--text-dim)" }}>
                  Consulta el estado en la página{" "}
                  <a href={`${import.meta.env.BASE_URL}mi-pedido`} className="gold-text">
                    Mi pedido
                  </a>
                  .
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
