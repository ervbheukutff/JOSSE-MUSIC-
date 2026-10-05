import React from "react";
import { FaInstagram, FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";
import { SiAudiomack } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="brand-line">JOSSE MUSIC</div>
        <p>R&amp;B romántico y urbano, directo desde el corazón hasta tus oídos.</p>
        <div className="footer-socials">
          <a href="https://audiomack.com" target="_blank" rel="noreferrer" aria-label="Audiomack">
            <SiAudiomack />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
            <FaYoutube />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
            <FaTiktok />
          </a>
        </div>
        <p style={{ fontSize: "0.75rem", opacity: 0.7 }}>
          © {new Date().getFullYear()} Josse Music. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
