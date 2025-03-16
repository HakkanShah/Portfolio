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
    <section id="projects" className="py-10 bg-gray-900 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold">Projects</h2>
        <div className="mt-6 flex justify-center gap-8">
          {projects.map((project, index) => (
            <div key={index} className="p-6 bg-gray-800 rounded-lg shadow-lg w-80">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="mt-2">{project.description}</p>
              <a href={project.link} className="text-blue-400 mt-4 inline-block">
                View Project
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
