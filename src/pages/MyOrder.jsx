import React, { useState } from "react";
import { fetchOrder } from "../utils/api.js";
import { FiDownload } from "react-icons/fi";

export default function MyOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const found = await fetchOrder(orderId);
      setOrder(found);
    } catch (err) {
      setOrder(null);
      setError(err.message || "No encontramos ese pedido.");
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-hero">
        <p className="section-kicker">Seguimiento</p>
        <h1>Mi pedido</h1>
        <p>
          Ingresa tu número de pedido (recibido al subir tu comprobante) para ver el estado de tu
          compra y tu enlace de descarga una vez confirmado el pago.
        </p>
      </div>
      <section className="section" style={{ paddingTop: "10px" }}>
        <div className="container" style={{ maxWidth: "520px" }}>
          <form className="form-box" onSubmit={handleSearch}>
            <div className="field">
              <label htmlFor="orderId">Número de pedido</label>
              <input
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Ej: JM-A1B2C3"
                required
              />
            </div>
            <button
              className="btn btn-solid"
              type="submit"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {loading ? "Buscando..." : "Buscar pedido"}
            </button>
          </form>

          {searched && !order && (
            <div className="status-msg err">
              {error || "No encontramos ese pedido. Verifica el número o contáctanos."}
            </div>
          )}

          {order && (
            <div className="order-card">
              <h3 style={{ color: "var(--gold-soft)", marginBottom: "6px" }}>{order.trackTitle}</h3>
              <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>Pedido {order.id}</p>
              <span className={`order-status ${order.status}`}>
                {order.status === "confirmed" ? "Pago confirmado" : "Pendiente de confirmación"}
              </span>

              {order.status === "confirmed" && order.downloadLink && (
                <div style={{ marginTop: "20px" }}>
                  <a
                    href={order.downloadLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-solid"
                  >
                    <FiDownload /> Descargar música
                  </a>
                </div>
              )}

              {order.status === "pending" && (
                <p style={{ marginTop: "16px", color: "var(--text-dim)", fontSize: "0.85rem" }}>
                  Tu pago está siendo verificado manualmente. Esto puede tardar algunas horas.
                  Vuelve a consultar más tarde con tu número de pedido.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
