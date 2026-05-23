/**
 * =========================================
 * COMPORTAMIENTOS GENERALES - LEANDRO CASTILLO BORJA
 * =========================================
 * Script nativo JS libre de dependencias complejas.
 * Manejo del Tema Claro/Oscuro, Menú Móvil y Animaciones.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTOS CLAVE ---
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const menuToggleBtn = document.getElementById('menu-toggle');
  const siteHeader = document.querySelector('.site-header');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const currentYearSpan = document.getElementById('current-year');

  /* =========================================
     1. GESTIÓN DE TEMA (CLARO / OSCURO)
     ========================================= */
  const setTheme = (theme, saveToStorage = true) => {
    // Aplicar atributo a la raíz html
    htmlElement.setAttribute('data-theme', theme);
    
    // Cambiar aria-label para accesibilidad
    if (theme === 'dark') {
      themeToggleBtn.setAttribute('aria-label', 'Cambiar a modo claro');
    } else {
      themeToggleBtn.setAttribute('aria-label', 'Cambiar a modo oscuro');
    }

    // Persistir preferencia
    if (saveToStorage) {
      localStorage.setItem('leandro-portfolio-theme', theme);
    }
  };

  // Inicializar Tema
  const initTheme = () => {
    const savedTheme = localStorage.getItem('leandro-portfolio-theme');
    
    // 1. Si hay tema guardado, usarlo
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme, false);
      return;
    }

    // 2. Si no hay tema guardado, verificar preferencia del sistema (OS)
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light', false);
    } else {
      // Por defecto tema oscuro como fondo moderno principal
      setTheme('dark', false);
    }
  };

  initTheme();

  // Escuchar evento Click del botón de alternar tema
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme, true);
  });

  // Escuchar cambios de preferencia del OS por si el usuario cambia el sistema mientras la app está abierta
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('leandro-portfolio-theme')) {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setTheme(newSystemTheme, false);
    }
  });


  /* =========================================
     2. MENÚ RESPONSIVE HAMBURGUESA
     ========================================= */
  const toggleMobileMenu = () => {
    siteHeader.classList.toggle('menu-open');
    const isOpen = siteHeader.classList.contains('menu-open');
    menuToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    
    // Bloquear scroll de fondo si el menú móvil está abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  menuToggleBtn.addEventListener('click', toggleMobileMenu);

  // Cerrar el menú al hacer clic en un enlace de navegación móvil
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (siteHeader.classList.contains('menu-open')) {
        toggleMobileMenu();
      }
    });
  });

  // Cerrar menú móvil si se agranda la pantalla de forma dinámica
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && siteHeader.classList.contains('menu-open')) {
      toggleMobileMenu();
    }
  });


  /* =========================================
     3. ANIMACIÓN AL HACER SCROLL (REVEAL ON SCROLL)
     ========================================= */
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Dejar de observar una vez animado
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null, // viewport
      threshold: 0.15, // animar cuando el 15% del elemento esté visible
      rootMargin: '0px 0px -50px 0px' // compensar un poco antes de aparecer
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback por si el navegador es muy antiguo y no soporta Intersection Observer
    revealElements.forEach(element => {
      element.classList.add('revealed');
    });
  }


  /* =========================================
     4. COMPORTAMIENTOS DINÁMICOS EXTRAS
     ========================================= */
  // Colocar año dinámico en el footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Offset adaptativo para scroll suave del Header para que al navegar no tape títulos
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Calcular offset del header fijo
        const headerHeight = siteHeader.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
