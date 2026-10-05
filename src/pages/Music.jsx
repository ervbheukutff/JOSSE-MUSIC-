import React, { useState } from "react";
import { catalog } from "../data/catalog.js";
import TrackCard from "../components/TrackCard.jsx";
import { FaSpotify } from "react-icons/fa";
import { SiAudiomack, SiApplemusic, SiYoutubemusic } from "react-icons/si";

const platforms = [
  { name: "Audiomack", icon: <SiAudiomack />, url: "https://audiomack.com", sub: "Escucha y descarga gratis" },
  { name: "Spotify", icon: <FaSpotify />, url: "https://spotify.com", sub: "Sigue el perfil" },
  { name: "Apple Music", icon: <SiApplemusic />, url: "https://music.apple.com", sub: "Disponible próximamente" },
  { name: "YouTube Music", icon: <SiYoutubemusic />, url: "https://music.youtube.com", sub: "Videos y audios" },
];

export default function Music() {
  const [filter, setFilter] = useState("Todos");
  const filtered =
    filter === "Todos" ? catalog : catalog.filter((t) => t.type === filter);

  return (
    <>
      <div className="page-hero">
        <p className="section-kicker">Catálogo</p>
        <h1>Sencillos &amp; Álbumes</h1>
        <p>Todo el catálogo de Josse Music en un solo lugar. Escucha con el reproductor integrado.</p>
      </div>
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", gap: "12px", marginBottom: "36px", flexWrap: "wrap" }}>
            {["Todos", "Sencillo", "Álbum"].map((f) => (
              <button
                key={f}
                className={`btn small ${filter === f ? "btn-solid" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="track-grid">
            {filtered.map((t) => (
              <TrackCard key={t.id} track={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-alt)" }}>
        <div className="container">
          <p className="section-kicker">También disponible en</p>
          <h2 className="section-title">Plataformas</h2>
          <p className="section-sub">Sigue y escucha a Josse Music en tus plataformas favoritas.</p>
          <div className="link-grid">
            {platforms.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="link-card">
                <span className="icon">{p.icon}</span>
                <span>
                  <span className="label">{p.name}</span>
                  <br />
                  <span className="sub">{p.sub}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
