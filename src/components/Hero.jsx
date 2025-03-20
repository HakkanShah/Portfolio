import React from "react";

const Hero = () => {
  return (
    <section id="home" className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <h2 className="text-5xl font-bold animate-fadeIn">Hi! I'm <span className="text-blue-400">Hakkan</span></h2>
      <p className="text-2xl mt-3 opacity-80">I'm a Full-Stack Developer</p>
      <a href="#projects">
        <button className="mt-6 px-8 py-3 bg-blue-500 hover:bg-blue-700 rounded-full text-lg transition">
          View My Work
        </button>
      </a>
    </section>
  );
};

export default Hero;
