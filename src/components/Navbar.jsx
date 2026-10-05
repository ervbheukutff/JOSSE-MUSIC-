import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/musica", label: "Música" },
  { to: "/comprar", label: "Comprar" },
  { to: "/mi-pedido", label: "Mi pedido" },
  { to: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const base = import.meta.env.BASE_URL;

  return (
    <header className="navbar">
      <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
        <img src={`${base}attachments/img_20260926_171806.jpg`} alt="Josse" />
        JOSSE MUSIC
      </NavLink>
      <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menú">
        {open ? <FiX /> : <FiMenu />}
      </button>
      <nav className={`nav-links ${open ? "open" : ""}`}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
