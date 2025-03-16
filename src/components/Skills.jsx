import React from "react";

const skills = ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"];

const Skills = () => {
  return (
    <section id="skills" className="py-10 bg-gray-800 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold">Skills</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {skills.map((skill, index) => (
            <span key={index} className="bg-blue-500 px-4 py-2 rounded-lg">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
