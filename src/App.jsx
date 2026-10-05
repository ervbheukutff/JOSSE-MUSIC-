import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import PlayerBar from "./components/PlayerBar.jsx";
import Home from "./pages/Home.jsx";
import Music from "./pages/Music.jsx";
import Buy from "./pages/Buy.jsx";
import MyOrder from "./pages/MyOrder.jsx";
import Contact from "./pages/Contact.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/musica" element={<Music />} />
          <Route path="/comprar" element={<Buy />} />
          <Route path="/mi-pedido" element={<MyOrder />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/panel-josse-2024" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <PlayerBar />
    </>
  );
}
