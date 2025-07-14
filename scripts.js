const form = document.getElementById('contact-form');
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = form.querySelector('input[type="text"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const message = form.querySelector('textarea').value.trim();

  if (name && email && message) {
    alert(`Thanks for reaching out, ${name}! I’ll get back to you soon.`);
    form.reset();
  } else {
    alert('Please fill in all the fields correctly!');
  }
});

/* 🎯 Smooth Scroll Fallback */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ✨ Typing Effect on Hero Title */
const heroTitle = document.querySelector('.hero h1');
const originalText = heroTitle.innerHTML;
const typingText = "Hi, I'm <span class='highlight'>Your Name</span>";
let index = 0;

function typeIt() {
  heroTitle.innerHTML = typingText.substring(0, index);
  index++;
  if (index <= typingText.length) {
    setTimeout(typeIt, 50);
  } else {
    heroTitle.innerHTML = originalText; // reset to original for responsive fallback
  }
}
window.addEventListener('load', typeIt);

/* 🌀 Card Tilt Hover */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (x - centerX) / 20;

    card.style.transform = `rotateX(${ -rotateX }deg) rotateY(${ rotateY }deg) scale(1.05)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
  });
}); 
