document.addEventListener('DOMContentLoaded', function() {
    
  // --- Theme Switcher ---
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  const body = document.body;

  // Function to apply theme from localStorage
  const applyTheme = () => {
      const savedTheme = localStorage.getItem('theme') || 'dark'; // default to dark
      body.className = savedTheme;
      updateIcon(savedTheme);
  };

  // Function to update the sun/moon icon
  const updateIcon = (theme) => {
      const iconClass = theme === 'light' ? 'fa-moon' : 'fa-sun';
      if (themeToggle) {
         themeToggle.innerHTML = `<i class="fas ${iconClass}"></i>`;
      }
      if(mobileThemeToggle) {
          mobileThemeToggle.innerHTML = `<i class="fas ${iconClass}"></i>`;
      }
  };

  // Function to toggle theme
  const toggleTheme = () => {
      const newTheme = body.classList.contains('light') ? 'dark' : 'light';
      body.className = newTheme;
      localStorage.setItem('theme', newTheme);
      updateIcon(newTheme);
  };

  if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
  }
  if(mobileThemeToggle) {
      mobileThemeToggle.addEventListener('click', toggleTheme);
  }


  // --- Typing Animation ---
  const typingText = document.getElementById('typing-text');
  const words = ["Frontend Developer.", "React Specialist.", "UI/UX Enthusiast.", "Problem Solver."];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
      const currentWord = words[wordIndex];
      const currentChars = currentWord.substring(0, charIndex);
      if (typingText) {
          typingText.textContent = currentChars;
      }

      if (!isDeleting && charIndex < currentWord.length) {
          charIndex++;
          setTimeout(type, 150);
      } else if (isDeleting && charIndex > 0) {
          charIndex--;
          setTimeout(type, 100);
      } else {
          isDeleting = !isDeleting;
          if (!isDeleting) {
              wordIndex = (wordIndex + 1) % words.length;
          }
          setTimeout(type, 1200);
      }
  }
  
  // --- Dynamic Project Loading ---
  const projects = [
      {
          title: 'Instagram Reels Downloader',
          description: 'A sleek and fast tool to download Instagram Reels videos. Built with a clean UI, this project focuses on user experience and performance, using Flask for the backend.',
          tags: ['Flask', 'HTML', 'CSS', 'JavaScript'],
          link: 'https://github.com/HakkanShah/reels-downloader'
      },
      {
          title: 'Hit The Jhatu',
          description: 'A fun and addictive meme-based web game created with vanilla JavaScript. It demonstrates core JS concepts like DOM manipulation and event handling in an entertaining way.',
          tags: ['JavaScript', 'HTML5', 'CSS3', 'Game Dev'],
          link: 'https://github.com/HakkanShah/hit-the-jhatu'
      },
      {
          title: 'Modern Portfolio Website',
          description: 'This very website! A responsive, modern portfolio featuring light/dark modes, animations, and dynamic content loading, built with Tailwind CSS and vanilla JS.',
          tags: ['Tailwind CSS', 'JavaScript', 'HTML', 'Responsive Design'],
          link: '#'
      },
      // Add more projects here
  ];

  const projectsContainer = document.getElementById('projects-container');

  if(projectsContainer) {
      projects.forEach(project => {
          const projectCard = document.createElement('div');
          projectCard.className = 'project-card reveal';
  
          const tagsHTML = project.tags.map(tag => 
              `<span class="inline-block bg-accent/20 text-accent text-xs font-semibold mr-2 px-2.5 py-1 rounded-full">${tag}</span>`
          ).join('');
  
          projectCard.innerHTML = `
              <div class="project-content text-left">
                  <h3 class="text-2xl font-bold mb-3">${project.title}</h3>
                  <p class="text-text/80 mb-4 flex-grow">${project.description}</p>
                  <div class="project-tags mt-4 mb-4">
                      ${tagsHTML}
                  </div>
                  <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="font-semibold text-accent hover:underline self-start">
                      View Project <i class="fas fa-arrow-right ml-1"></i>
                  </a>
              </div>
          `;
          projectsContainer.appendChild(projectCard);
      });
  }

  // --- Header Scroll Effect ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
  });

  // --- Mobile Menu Toggle ---
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
      mobileMenu.classList.toggle('hidden');
      // Toggle icon between bars and times (X)
      menuBtn.innerHTML = mobileMenu.classList.contains('hidden') ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
  };

  if (menuBtn) {
      menuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  // Close mobile menu when a link is clicked
  mobileNavLinks.forEach(link => {
      link.addEventListener('click', toggleMobileMenu);
  });

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      revealElements.forEach(el => {
          const elementTop = el.getBoundingClientRect().top;
          if (elementTop < windowHeight - 100) {
              el.classList.add('active');
          }
      });
  };

  window.addEventListener('scroll', revealOnScroll);
  
  // Initial calls on page load
  applyTheme();
  type();
  revealOnScroll();
});
