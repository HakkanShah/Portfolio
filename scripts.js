document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  const preloader = document.querySelector('.preloader');
  window.addEventListener('load', () => {
      preloader.style.display = 'none';
  });

  // Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
              behavior: 'smooth'
          });
      });
  });

  // Theme switcher
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme) {
      document.body.setAttribute('data-theme', currentTheme);
      if (currentTheme === 'dark') {
          themeToggle.checked = true;
      }
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

  copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailLink.textContent).then(() => {
          alert('Email copied to clipboard!');
      }, () => {
          alert('Failed to copy email.');
      });
  });
});