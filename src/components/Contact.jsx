import React from "react";

const Contact = () => {
  return (
    <section id="contact" className="py-10 bg-gray-900 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold">Contact Me</h2>
        <form className="mt-6 max-w-lg mx-auto">
          <input type="text" placeholder="Your Name" className="w-full p-2 mb-4 bg-gray-800 border-b-2 border-blue-400" />
          <input type="email" placeholder="Your Email" className="w-full p-2 mb-4 bg-gray-800 border-b-2 border-blue-400" />
          <textarea placeholder="Your Message" className="w-full p-2 mb-4 bg-gray-800 border-b-2 border-blue-400"></textarea>
          <button className="px-6 py-2 bg-blue-500 hover:bg-blue-700 rounded-lg">Send</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
