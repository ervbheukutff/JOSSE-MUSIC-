import React from "react";
import { Link } from "react-router-dom";
import { FiPlay } from "react-icons/fi";
import { catalog } from "../data/catalog.js";
import TrackCard from "../components/TrackCard.jsx";
import { usePlayer } from "../context/PlayerContext.jsx";

export default function Home() {
  const base = import.meta.env.BASE_URL;
  const { playTrack } = usePlayer();
  const featured = catalog.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-photo-wrap">
          <img src={`${base}attachments/img_20260926_171806.jpg`} alt="Josse, artista de R&B" />
        </div>
        <div className="hero-content">
          <p className="section-kicker">R&amp;B Romántico &amp; Urbano</p>
          <h1>
            La voz que traduce <span>lo que sientes</span>
          </h1>
          <p>
            Josse Music fusiona el romanticismo del R&amp;B clásico con la calle y el alma latina.
            Sencillos y álbumes hechos para escucharse de noche, con la luz baja y el corazón
            abierto.
          </p>
          <div className="hero-actions">
            <button className="btn btn-solid" onClick={() => playTrack(catalog[0])}>
              <FiPlay /> Escuchar ahora
            </button>
            <Link to="/comprar" className="btn btn-wine">
              Comprar en USDT
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="bio">
        <div className="container bio-grid">
          <div className="bio-photo">
            <img src={`${base}attachments/img_20260926_171806.jpg`} alt="Josse en el estudio" />
          </div>
          <div className="bio-text">
            <p className="section-kicker">Biografía</p>
            <h2>Josse</h2>
            <p>
              Nacido y criado entre melodías de barrio y baladas de madrugada, Josse construyó su
              sonido en la intersección del R&amp;B romántico y la energía urbana. Cada canción
              nace de una historia real: amores que llegan, que se van, que se quedan a vivir en
              una canción.
            </p>
            <p>
              Con una voz cálida y letras honestas, Josse ha llevado su música a plataformas como
              Audiomack y ha construido una comunidad fiel tanto en Cuba como en la diáspora, que
              encuentra en sus canciones una forma de sentirse acompañada.
            </p>
            <p>
              Este espacio es su hogar digital: aquí puedes escuchar cada lanzamiento, conocer su
              historia y apoyar su música directamente, sin intermediarios.
            </p>
            <div className="stats-row">
              <div className="stat">
                <b>{catalog.length}+</b>
                <span>LANZAMIENTOS</span>
              </div>
              <div className="stat">
                <b>100%</b>
                <span>INDEPENDIENTE</span>
              </div>
              <div className="stat">
                <b>USDT</b>
                <span>PAGO DIRECTO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-alt)" }}>
        <div className="container">
          <p className="section-kicker">Lo más reciente</p>
          <h2 className="section-title">Escucha ahora</h2>
          <p className="section-sub">
            Una selección de sencillos y álbumes. Da play y siente el R&amp;B de Josse.
          </p>
          <div className="track-grid">
            {featured.map((t) => (
              <TrackCard key={t.id} track={t} />
            ))}
          </div>
          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <Link to="/musica" className="btn btn-wine">
              Ver toda la música
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
