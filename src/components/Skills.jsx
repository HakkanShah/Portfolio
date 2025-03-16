import React from "react";

const skills = ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"];

const Skills = () => {
  return (
    <section id="skills" className="py-16 bg-gray-800 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-400 mb-6">Skills</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, index) => (
            <span key={index} className="bg-blue-500 px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-blue-600 transition">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
