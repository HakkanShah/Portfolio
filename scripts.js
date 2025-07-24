document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  const preloader = document.querySelector('.preloader');
  window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
          preloader.style.display = 'none';
      }, 500);
  });

  // Hamburger Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
  }));


  // Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
  });

  // Theme switcher
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  const setAppTheme = (theme) => {
      document.body.setAttribute('data-theme', theme);
      if (theme === 'dark') {
          themeToggle.checked = true;
      } else {
          themeToggle.checked = false;
      }
  };

  if (currentTheme) {
      setAppTheme(currentTheme);
  }

  themeToggle.addEventListener('change', () => {
      if (themeToggle.checked) {
          document.body.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
      } else {
          document.body.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
      }
  });

  // Email copy to clipboard
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailLink = document.getElementById('email-link');

  if (copyEmailBtn && emailLink) {
      copyEmailBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(emailLink.textContent).then(() => {
              // You can add a more sophisticated notification here
              alert('Email copied to clipboard!');
          }, () => {
              alert('Failed to copy email.');
          });
      });
  }

  // Scroll reveal animations
  const sr = ScrollReveal({
      origin: 'top',
      distance: '60px',
      duration: 2500,
      delay: 400,
      // reset: true // uncomment to repeat animation on scroll
  });

  sr.reveal(`.hero-content, .about-content`);
  sr.reveal(`.hero-image`, { origin: 'bottom' });
  sr.reveal(`.project-card`, { interval: 100 });
  sr.reveal(`.skills-grid, .contact-info, .footer`, { origin: 'bottom' });
});