import React, { useEffect, useState } from "react";
import {
  adminLogin,
  fetchAdminOrders,
  confirmOrder,
  revertOrder,
  proofUrl,
  getAdminToken,
  clearAdminToken,
} from "../utils/api.js";
import { FiLock, FiLogOut } from "react-icons/fi";

export default function Admin() {
  const [authed, setAuthed] = useState(!!getAdminToken());
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [links, setLinks] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await fetchAdminOrders();
      setOrders(data);
    } catch (err) {
      setLoadError(err.message || "No se pudieron cargar los pedidos.");
      if (/sesión|autorizado/i.test(err.message || "")) {
        setAuthed(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) loadOrders();
  }, [authed]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await adminLogin(pass);
      setAuthed(true);
      setPass("");
    } catch (err) {
      setError(err.message || "Contraseña incorrecta.");
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setAuthed(false);
    setOrders([]);
  };

  const handleConfirm = async (id) => {
    const link = links[id];
    if (!link) return;
    try {
      await confirmOrder(id, link);
      loadOrders();
    } catch (err) {
      setLoadError(err.message || "No se pudo confirmar el pedido.");
    }
  };

  const handleRevert = async (id) => {
    try {
      await revertOrder(id);
      loadOrders();
    } catch (err) {
      setLoadError(err.message || "No se pudo revertir el pedido.");
    }
  };

  if (!authed) {
    return (
      <div className="container">
        <div className="form-box admin-login">
          <h2
            style={{
              marginBottom: "18px",
              color: "var(--gold-soft)",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <FiLock /> Panel del artista
          </h2>
          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="pass">Contraseña</label>
              <input
                id="pass"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Contraseña de administrador"
              />
            </div>
            <button
              className="btn btn-solid"
              type="submit"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Entrar
            </button>
            {error && <div className="status-msg err">{error}</div>}
          </form>
          <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "14px" }}>
            Acceso exclusivo para Josse. Aquí se confirman los pagos y se otorgan los enlaces de
            descarga. La sesión se verifica contra el backend real y expira automáticamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "130px", paddingBottom: "100px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div>
          <p className="section-kicker">Panel privado</p>
          <h1 className="section-title">Pedidos y comprobantes</h1>
          <p className="section-sub">
            Revisa cada comprobante subido por los fans, verifica el pago en tu wallet USDT y
            confirma para otorgar el enlace de descarga.
          </p>
        </div>
        <button className="btn small" onClick={handleLogout}>
          <FiLogOut /> Cerrar sesión
        </button>
      </div>

      {loadError && <div className="status-msg err">{loadError}</div>}
      {loading && <p style={{ color: "var(--text-dim)" }}>Cargando pedidos...</p>}

      {!loading && orders.length === 0 && !loadError ? (
        <p style={{ color: "var(--text-dim)" }}>Aún no hay pedidos.</p>
      ) : (
        orders.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Música</th>
                  <th>Fan</th>
                  <th>Monto</th>
                  <th>Tx Hash</th>
                  <th>Comprobante</th>
                  <th>Estado</th>
                  <th>Enlace de descarga</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.trackTitle}</td>
                    <td>
                      {o.nombre}
                      <br />
                      <span style={{ color: "var(--text-dim)" }}>{o.email}</span>
                    </td>
                    <td>${o.price} USDT</td>
                    <td style={{ maxWidth: "140px", wordBreak: "break-all" }}>{o.txHash || "—"}</td>
                    <td>
                      {o.hasProof ? (
                        <a
                          href={proofUrl(o.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="proof-link"
                        >
                          Ver imagen
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span className={o.status === "confirmed" ? "badge-confirmed" : "badge-pending"}>
                        {o.status === "confirmed" ? "Confirmado" : "Pendiente"}
                      </span>
                    </td>
                    <td>
                      {o.status === "confirmed" ? (
                        <a href={o.downloadLink} target="_blank" rel="noreferrer" className="proof-link">
                          {o.downloadLink}
                        </a>
                      ) : (
                        <input
                          className="admin-inline-input"
                          placeholder="URL de descarga"
                          value={links[o.id] ?? ""}
                          onChange={(e) => setLinks({ ...links, [o.id]: e.target.value })}
                        />
                      )}
                    </td>
                    <td>
                      {o.status === "confirmed" ? (
                        <button className="btn small" onClick={() => handleRevert(o.id)}>
                          Revertir
                        </button>
                      ) : (
                        <button className="btn small btn-solid" onClick={() => handleConfirm(o.id)}>
                          Confirmar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
