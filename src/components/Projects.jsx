import React from "react";

const projects = [
  {
    title: "Project 1",
    description: "A brief description of your project.",
    link: "#",
  },
  {
    title: "Project 2",
    description: "Another project description.",
    link: "#",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-blue-400">Projects</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {projects.map((project, index) => (
            <div key={index} className="p-6 bg-gray-800 rounded-lg shadow-lg w-80 hover:scale-105 transition transform">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="mt-2 opacity-80">{project.description}</p>
              <a href={project.link} className="text-blue-400 mt-4 inline-block hover:text-blue-600 transition">
                View Project →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
