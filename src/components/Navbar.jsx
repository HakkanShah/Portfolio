import React, { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white p-4 fixed w-full top-0 shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-400">My Portfolio</h1>
        
        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li><a href="#home" className="hover:text-blue-400 transition">Home</a></li>
          <li><a href="#projects" className="hover:text-blue-400 transition">Projects</a></li>
          <li><a href="#skills" className="hover:text-blue-400 transition">Skills</a></li>
          <li><a href="#contact" className="hover:text-blue-400 transition">Contact</a></li>
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <ul className="md:hidden bg-gray-800 text-center p-4 space-y-3">
          <li><a href="#home" className="block hover:text-blue-400">Home</a></li>
          <li><a href="#projects"
          <li><a href="#projects" className="block hover:text-blue-400">About</a></li> className="block hover:text-blue-400">Projects</a></li>
          <li><a href="#skills" className="block hover:text-blue-400">Skills</a></li>
          <li><a href="#contact" className="block hover:text-blue-400">Contact</a></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
