import React from "react";
import { FiPlay, FiPause } from "react-icons/fi";
import { usePlayer } from "../context/PlayerContext.jsx";
import { Link } from "react-router-dom";

export default function TrackCard({ track }) {
  const { current, isPlaying, playTrack } = usePlayer();
  const active = current && current.id === track.id;

  return (
    <div className="track-card">
      <div className="track-cover">
        <span className="cover-title">{track.title}</span>
        <div className="play-overlay">
          <button className="play-btn" onClick={() => playTrack(track)} aria-label="Reproducir">
            {active && isPlaying ? <FiPause /> : <FiPlay />}
          </button>
        </div>
      </div>
      <div className="track-info">
        <h4>{track.title}</h4>
        <div className="tag">
          <span>
            {track.type} · {track.year}
          </span>
          <span className="price">${track.price} USDT</span>
        </div>
        <Link
          to="/comprar"
          state={{ trackId: track.id }}
          className="btn small btn-wine"
          style={{ marginTop: "12px", width: "100%", justifyContent: "center" }}
        >
          Comprar
        </Link>
      </div>
    </div>
  );
}
