document.addEventListener('DOMContentLoaded', () => {
  const yearField = document.getElementById('year');
  if (yearField) {
    yearField.textContent = new Date().getFullYear();
  }

  document.body.classList.add('scroll-animations');

  const iconButtons = document.querySelectorAll('.icon-btn');
  iconButtons.forEach((button) => {
    const wrapper = button.querySelector('.icon-wrapper');
    if (!wrapper) return;

    let rafId = null;

    const animateTo = (x, y) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const pullStrength = 0.32;
        wrapper.style.transform = `translate(${x * pullStrength}px, ${y * pullStrength}px)`;
      });
    };

    const handleMove = (event) => {
      const rect = button.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      animateTo(offsetX, offsetY);
    };

    const reset = () => {
      cancelAnimationFrame(rafId);
      wrapper.style.transform = 'translate(0, 0)';
    };

    button.addEventListener('mousemove', handleMove);
    button.addEventListener('mouseenter', (event) => {
      if (event.clientX && event.clientY) {
        handleMove(event);
      }
    });
    button.addEventListener('mouseleave', reset);
    button.addEventListener('blur', reset);
    button.addEventListener('touchstart', reset, { passive: true });
  });

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
  };

  const revealElements = () => {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      img.classList.add('reveal-on-scroll');
    });

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, observerOptions);

      images.forEach((img) => revealObserver.observe(img));
    } else {
      images.forEach((img) => img.classList.add('is-visible'));
    }
  };

  revealElements();

  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const carouselContainers = document.querySelectorAll('.hover-carousel');
  carouselContainers.forEach((container) => {
    const stack = container.querySelector('.media-stack');
    if (!stack) return;
    const slides = Array.from(stack.querySelectorAll('img'));
    if (slides.length <= 1) return;

    let index = 0;
    let intervalId = null;
    let startTimer = null;

    const showSlide = (nextIndex) => {
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === nextIndex);
      });
    };

    const startCarousel = () => {
      if (intervalId) return;
      container.classList.add('carousel-active');
      startTimer = setTimeout(() => {
        intervalId = setInterval(() => {
          index = (index + 1) % slides.length;
          showSlide(index);
        }, 1200);
      }, 180);
    };

    const stopCarousel = () => {
      container.classList.remove('carousel-active');
      clearTimeout(startTimer);
      startTimer = null;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      index = 0;
      showSlide(index);
    };

    if (supportsHover) {
      container.addEventListener('mouseenter', startCarousel);
      container.addEventListener('mouseleave', stopCarousel);
      container.addEventListener('focusin', startCarousel);
      container.addEventListener('focusout', stopCarousel);
    } else {
      container.addEventListener('click', () => {
        index = (index + 1) % slides.length;
        showSlide(index);
      });
      container.addEventListener('mouseleave', () => {
        index = 0;
        showSlide(index);
      });
    }
  });
});
