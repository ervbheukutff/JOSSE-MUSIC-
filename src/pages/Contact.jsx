import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    tipo: "Contratación / Show",
    mensaje: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("https://hyperdev.com/external-api/published-apps/form-submissions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_host: window.location.hostname,
          form_name: "Contacto / Contrataciones",
          fields: {
            Nombre: form.nombre,
            Email: form.email,
            "Tipo de solicitud": form.tipo,
            Mensaje: form.mensaje,
          },
        }),
      });
      if (res.ok) {
        setStatus({ ok: true, msg: "Gracias por escribir. Recibimos tu mensaje y te responderemos pronto por correo." });
        setForm({ nombre: "", email: "", tipo: "Contratación / Show", mensaje: "" });
      } else {
        setStatus({ ok: false, msg: "Something went wrong, please try again" });
      }
    } catch {
      setStatus({ ok: false, msg: "Something went wrong, please try again" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-hero">
        <p className="section-kicker">Contrataciones &amp; Shows</p>
        <h1>Hablemos</h1>
        <p>
          ¿Quieres contratar a Josse para un show, colaboración o evento privado? Escríbenos y te
          responderemos a la brevedad.
        </p>
      </div>
      <section className="section" style={{ paddingTop: "10px" }}>
        <div className="container" style={{ maxWidth: "620px" }}>
          <form className="form-box" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
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
                placeholder="tucorreo@ejemplo.com"
              />
            </div>
            <div className="field">
              <label htmlFor="tipo">Tipo de solicitud</label>
              <select id="tipo" name="tipo" value={form.tipo} onChange={handleChange}>
                <option>Contratación / Show</option>
                <option>Colaboración musical</option>
                <option>Prensa / Entrevista</option>
                <option>Otro</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={5}
                required
                value={form.mensaje}
                onChange={handleChange}
                placeholder="Cuéntanos sobre tu evento o propuesta..."
              />
            </div>
            <button className="btn btn-solid" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? "Enviando..." : "Enviar mensaje"}
            </button>
            {status && (
              <div className={`status-msg ${status.ok ? "ok" : "err"}`}>{status.msg}</div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
