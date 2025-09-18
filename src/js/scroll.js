const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -10% 0px'
};

export const initializeScrollAnimations = (root = document) => {
  const targets = Array.from(root.querySelectorAll('img'));
  targets.forEach((img) => {
    img.classList.add('reveal-on-scroll');
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach((img) => img.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  targets.forEach((img) => revealObserver.observe(img));
};
