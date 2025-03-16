import React from "react";

const Hero = () => {
  return (
    <section id="home" className="h-screen flex flex-col justify-center items-center bg-gray-800 text-white">
      <h2 className="text-4xl font-bold">Hi, I'm <span className="text-blue-400">Hakkan</span></h2>
      <p className="text-xl mt-2">I'm a Full-Stack Developer</p>
      <a href="#projects">
        <button className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-700 rounded-lg text-lg">
          View My Work
        </button>
      </a>
    </section>
  );
};

export default Hero;
