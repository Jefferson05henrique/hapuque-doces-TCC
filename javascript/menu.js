// Aguardar o DOM estar pronto para inicializar elementos
document.addEventListener('DOMContentLoaded', () => {
  // Menu Hamburger Toggle
  const menuToggle = document.getElementById('menuToggle');
  const menuOverlay = document.getElementById('menuOverlay');
  const body = document.body;

  // Verifica se elementos existem
  if (menuToggle && menuOverlay) {
    // Toggle menu ao clicar no botão
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      menuToggle.classList.toggle('active');
      menuOverlay.classList.toggle('active');
      body.classList.toggle('menu-open');
    });

    // Fechar menu ao clicar em um link
    const menuLinks = menuOverlay.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
      });
    });

    // Fechar menu ao clicar fora dele
    menuOverlay.addEventListener('click', (e) => {
      if (e.target === menuOverlay) {
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
      }
    });
  }

  // Scroll suave para o indicador de scroll
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const heroSection = document.querySelector('.hapu-fullscreen');
      const nextSection = heroSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Animação de entrada dos cards (Intersection Observer)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observar elementos que devem animar
  const animatedElements = document.querySelectorAll('.card-3d, .grid-item, .sobre-content');
  animatedElements.forEach(el => observer.observe(el));
});

// Animação do header ao fazer scroll
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Adiciona background ao header após rolar
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});
