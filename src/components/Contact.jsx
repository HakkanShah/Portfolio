import React from "react";

const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-400 mb-6">Contact Me</h2>
        <form className="mt-6 max-w-lg mx-auto">
          <input type="text" placeholder="Your Name" className="w-full p-3 mb-4 bg-gray-800 border-b-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 transition" />
          <input type="email" placeholder="Your Email" className="w-full p-3 mb-4 bg-gray-800 border-b-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 transition" />
          <textarea placeholder="Your Message" className="w-full p-3 mb-4 bg-gray-800 border-b-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 transition"></textarea>
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-700 rounded-lg text-lg transition">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
