import React from "react";
import { FiPlay, FiPause } from "react-icons/fi";
import { usePlayer } from "../context/PlayerContext.jsx";

function fmt(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function PlayerBar() {
  const { current, isPlaying, progress, duration, togglePlay, seek } = usePlayer();

  return (
    <div className={`player-bar ${current ? "visible" : ""}`}>
      {current && (
        <>
          <div className="player-track-meta">
            <div className="player-cover">R&amp;B</div>
            <div className="titles">
              <h5>{current.title}</h5>
              <span>{current.type}</span>
            </div>
          </div>
          <div className="player-controls">
            <button className="main-play" onClick={togglePlay} aria-label="Reproducir/pausar">
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
            <div className="progress-row">
              <span>{fmt(progress)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={progress}
                onChange={(e) => seek(Number(e.target.value))}
              />
              <span>{fmt(duration)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
