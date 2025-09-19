import { initializeScrollAnimations } from './scroll.js';

const initNavigation = (bodyEl) => {
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const navOverlay = document.querySelector('.nav-overlay');
  let navFocusTimeout = null;

  const closeNav = (returnFocus = false) => {
    bodyEl.classList.remove('nav-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
      if (returnFocus) {
        menuToggle.focus();
      }
    }
    if (navOverlay) {
      navOverlay.setAttribute('hidden', '');
    }
    if (navFocusTimeout) {
      clearTimeout(navFocusTimeout);
      navFocusTimeout = null;
    }
  };

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      if (bodyEl.classList.contains('nav-open')) {
        closeNav();
        return;
      }

      bodyEl.classList.add('nav-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Close navigation menu');
      if (navOverlay) {
        navOverlay.removeAttribute('hidden');
      }

      const firstNavLink = primaryNav.querySelector('a');
      if (firstNavLink) {
        navFocusTimeout = window.setTimeout(() => {
          firstNavLink.focus({ preventScroll: true });
          navFocusTimeout = null;
        }, 220);
      }
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', () => closeNav(true));
    }

    primaryNav.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      if (link) {
        closeNav();
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && bodyEl.classList.contains('nav-open')) {
        event.preventDefault();
        closeNav(true);
      }
    });

    const navResetQuery = window.matchMedia('(min-width: 781px)');
    navResetQuery.addEventListener('change', (event) => {
      if (event.matches) {
        closeNav();
      }
    });
  } else if (navOverlay) {
    navOverlay.setAttribute('hidden', '');
  }
};

const initProductGrids = (prefersReducedMotion, reduceMotionQuery) => {
  const productGrids = Array.from(document.querySelectorAll('.product-grid'));
  const mobileSliderQuery = window.matchMedia('(max-width: 720px)');
  const sliderStates = new Map();

  const stopGridSlider = (grid) => {
    const state = sliderStates.get(grid);
    if (!state) return;

    window.clearTimeout(state.timeoutId);
    if (state.intervalId) {
      window.clearInterval(state.intervalId);
    }

    state.images.forEach((img) => {
      img.removeEventListener('load', state.handleImageLoad);
    });

    state.cards.forEach((card) => {
      card.classList.remove('is-active');
      card.removeAttribute('aria-hidden');
    });

    grid.style.removeProperty('--mobile-card-height');
    sliderStates.delete(grid);
  };

  const startGridSlider = (grid) => {
    if (sliderStates.has(grid)) return;

    const cards = Array.from(grid.querySelectorAll('.product-card'));
    if (cards.length <= 1) return;

    const state = {
      cards,
      index: 0,
      timeoutId: null,
      intervalId: null,
      images: Array.from(grid.querySelectorAll('img')),
      handleImageLoad: () => {},
      updateHeight: () => {}
    };

    state.updateHeight = () => {
      window.requestAnimationFrame(() => {
        const activeCard = state.cards[state.index];
        if (!activeCard) return;
        grid.style.setProperty('--mobile-card-height', `${activeCard.offsetHeight}px`);
      });
    };

    state.handleImageLoad = () => state.updateHeight();

    cards.forEach((card, idx) => {
      const isActive = idx === 0;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    state.images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', state.handleImageLoad);
      }
    });

    state.updateHeight();

    const advance = () => {
      const currentCard = state.cards[state.index];
      if (currentCard) {
        currentCard.classList.remove('is-active');
        currentCard.setAttribute('aria-hidden', 'true');
      }

      state.index = (state.index + 1) % state.cards.length;
      const nextCard = state.cards[state.index];
      nextCard.classList.add('is-active');
      nextCard.setAttribute('aria-hidden', 'false');
      state.updateHeight();
    };

    state.timeoutId = window.setTimeout(() => {
      advance();
      state.intervalId = window.setInterval(advance, 5200);
    }, 4200);

    sliderStates.set(grid, state);
  };

  const applyMobileSlider = (shouldEnable) => {
    productGrids.forEach((grid) => {
      if (shouldEnable) {
        startGridSlider(grid);
      } else {
        stopGridSlider(grid);
      }
    });
  };

  if (!prefersReducedMotion.value) {
    applyMobileSlider(mobileSliderQuery.matches);
  }

  mobileSliderQuery.addEventListener('change', (event) => {
    if (prefersReducedMotion.value) return;
    applyMobileSlider(event.matches);
  });

  reduceMotionQuery.addEventListener('change', (event) => {
    prefersReducedMotion.value = event.matches;
    if (prefersReducedMotion.value) {
      applyMobileSlider(false);
    } else {
      applyMobileSlider(mobileSliderQuery.matches);
    }
  });

  window.addEventListener('resize', () => {
    sliderStates.forEach((state) => state.updateHeight());
  });
};

const initScrollTop = (prefersReducedMotion, scrollTopButton) => {
  if (!scrollTopButton) {
    return;
  }

  const scrollTopDesktopQuery = window.matchMedia('(min-width: 900px)');

  const setScrollTopVisibility = (isVisible) => {
    scrollTopButton.classList.toggle('is-visible', isVisible);
    if (isVisible) {
      scrollTopButton.removeAttribute('aria-hidden');
      scrollTopButton.removeAttribute('tabindex');
    } else {
      scrollTopButton.setAttribute('aria-hidden', 'true');
      scrollTopButton.setAttribute('tabindex', '-1');
    }
  };

  const updateScrollTopVisibility = () => {
    const shouldShow = scrollTopDesktopQuery.matches && window.scrollY > 160;
    setScrollTopVisibility(shouldShow);
  };

  scrollTopButton.addEventListener('click', () => {
    if (prefersReducedMotion.value) {
      window.scrollTo({ top: 0 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });
  scrollTopDesktopQuery.addEventListener('change', updateScrollTopVisibility);
  window.addEventListener('resize', updateScrollTopVisibility);
  updateScrollTopVisibility();
};

const initExpandableMediaStacks = () => {
  const stacks = Array.from(document.querySelectorAll('.media-stack.expandable-grid'));
  if (!stacks.length) {
    return;
  }

  stacks.forEach((stack) => {
    // Guard against gallery images accidentally inheriting the expandable behaviour.
    if (stack.closest('.gallery')) {
      return;
    }

    const hoverGrid = stack.querySelector('.hover-grid');
    if (!hoverGrid) {
      return;
    }

    const tiles = Array.from(hoverGrid.querySelectorAll('[data-grid-tile]'));
    if (!tiles.length) {
      return;
    }

    let expandTimer = null;
    let lastPointerPosition = null;

    const clearExpandTimer = () => {
      if (expandTimer) {
        window.clearTimeout(expandTimer);
        expandTimer = null;
      }
    };

    const setActiveTile = (tileId) => {
      if (!tileId) {
        hoverGrid.removeAttribute('data-active-tile');
        return;
      }

      hoverGrid.setAttribute('data-active-tile', tileId);
    };

    // Highlight the tile that lives under the recorded pointer coordinates once the grid opens.
    const updateActiveTileFromPoint = (position) => {
      if (!position) {
        return false;
      }

      const { x, y } = position;
      if (typeof x !== 'number' || typeof y !== 'number') {
        return false;
      }

      const elementAtPoint = document.elementFromPoint(x, y);
      if (!elementAtPoint) {
        return false;
      }

      const tileTarget = elementAtPoint.closest('[data-grid-tile]');
      if (!tileTarget || !hoverGrid.contains(tileTarget)) {
        return false;
      }

      const tileId = tileTarget.getAttribute('data-grid-tile');
      if (!tileId) {
        return false;
      }

      setActiveTile(tileId);
      return true;
    };

    const showGrid = () => {
      if (!stack.classList.contains('is-grid-visible')) {
        stack.classList.add('is-grid-visible');
      }

      window.requestAnimationFrame(() => {
        if (!updateActiveTileFromPoint(lastPointerPosition)) {
          const firstTileId = tiles[0].getAttribute('data-grid-tile');
          if (firstTileId) {
            setActiveTile(firstTileId);
          }
        }
      });
    };

    const hideGrid = () => {
      stack.classList.remove('is-grid-visible');
      hoverGrid.removeAttribute('data-active-tile');
      lastPointerPosition = null;
    };

    const scheduleGrid = () => {
      clearExpandTimer();
      expandTimer = window.setTimeout(() => {
        showGrid();
        expandTimer = null;
      }, 2000);
    };

    const recordPointerPosition = (event) => {
      lastPointerPosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    stack.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') {
        return;
      }

      recordPointerPosition(event);
      scheduleGrid();
    });

    stack.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch' || stack.classList.contains('is-grid-visible')) {
        return;
      }

      recordPointerPosition(event);
    });

    stack.addEventListener('pointerleave', () => {
      clearExpandTimer();
      hideGrid();
    });

    stack.addEventListener('focusin', () => {
      scheduleGrid();
    });

    stack.addEventListener('focusout', (event) => {
      if (!stack.contains(event.relatedTarget)) {
        clearExpandTimer();
        hideGrid();
      }
    });

    hoverGrid.addEventListener('pointerleave', () => {
      hoverGrid.removeAttribute('data-active-tile');
    });

    tiles.forEach((tile) => {
      const tileId = tile.getAttribute('data-grid-tile');
      if (!tileId) {
        return;
      }

      tile.addEventListener('pointerenter', () => {
        setActiveTile(tileId);
      });

      tile.addEventListener('pointerleave', (event) => {
        const nextTarget = event.relatedTarget;
        if (!(nextTarget instanceof HTMLElement)) {
          hoverGrid.removeAttribute('data-active-tile');
          return;
        }

        if (!hoverGrid.contains(nextTarget)) {
          hoverGrid.removeAttribute('data-active-tile');
          return;
        }

        if (!nextTarget.closest('[data-grid-tile]')) {
          hoverGrid.removeAttribute('data-active-tile');
        }
      });
    });
  });
};

const initHoverCarousels = () => {
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const carouselContainers = document.querySelectorAll('.hover-carousel');

  carouselContainers.forEach((container) => {
    const stack = container.querySelector('.media-stack');
    if (!stack) return;

    const slides = Array.from(stack.querySelectorAll('img[data-slide]'));
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
      startTimer = window.setTimeout(() => {
        intervalId = window.setInterval(() => {
          index = (index + 1) % slides.length;
          showSlide(index);
        }, 1200);
      }, 180);
    };

    const stopCarousel = () => {
      container.classList.remove('carousel-active');
      if (startTimer) {
        window.clearTimeout(startTimer);
        startTimer = null;
      }
      if (intervalId) {
        window.clearInterval(intervalId);
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
};

const initModalSystem = (bodyEl) => {
  const overlay = document.querySelector('[data-modal-overlay]');
  const modalTriggers = Array.from(document.querySelectorAll('[data-modal-target]'));
  const closeButtons = Array.from(document.querySelectorAll('[data-modal-close]'));
  const modalCache = new Map();
  let activeModal = null;
  let activeTrigger = null;
  let overlayHideTimer = null;

  const getModalById = (modalId) => {
    if (!modalId) return null;
    if (!modalCache.has(modalId)) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.setAttribute('aria-hidden', modal.hasAttribute('hidden') ? 'true' : 'false');
        modalCache.set(modalId, modal);
      }
    }

    return modalCache.get(modalId) ?? null;
  };

  const showOverlay = () => {
    if (!overlay) return;
    if (overlayHideTimer) {
      window.clearTimeout(overlayHideTimer);
      overlayHideTimer = null;
    }
    overlay.removeAttribute('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(() => {
      overlay.classList.add('is-visible');
    });
  };

  const hideOverlay = () => {
    if (!overlay) return;
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    overlayHideTimer = window.setTimeout(() => {
      overlay.setAttribute('hidden', '');
      overlayHideTimer = null;
    }, 280);
  };

  const focusModal = (modal) => {
    const autofocusTarget = modal.querySelector('[data-modal-autofocus]');
    if (autofocusTarget instanceof HTMLElement) {
      autofocusTarget.focus({ preventScroll: true });
      return;
    }

    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const firstFocusable = modal.querySelector(focusableSelectors);
    if (firstFocusable instanceof HTMLElement) {
      firstFocusable.focus({ preventScroll: true });
    } else {
      modal.focus({ preventScroll: true });
    }
  };

  const closeModal = (returnFocus = true) => {
    if (!activeModal) return;

    const modalToClose = activeModal;
    modalToClose.classList.remove('is-visible');
    modalToClose.setAttribute('aria-hidden', 'true');
    window.setTimeout(() => {
      if (!modalToClose.classList.contains('is-visible')) {
        modalToClose.setAttribute('hidden', '');
      }
    }, 280);

    bodyEl.classList.remove('modal-open');
    hideOverlay();

    if (returnFocus && activeTrigger instanceof HTMLElement) {
      activeTrigger.focus({ preventScroll: true });
    }

    activeModal = null;
    activeTrigger = null;
  };

  const openModal = (modal, trigger) => {
    if (!modal || activeModal === modal) {
      return;
    }

    if (activeModal && activeModal !== modal) {
      closeModal(false);
    }

    modal.removeAttribute('hidden');
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    activeModal = modal;
    activeTrigger = trigger instanceof HTMLElement ? trigger : null;

    bodyEl.classList.add('modal-open');
    showOverlay();

    window.requestAnimationFrame(() => {
      focusModal(modal);
    });
  };

  modalTriggers.forEach((trigger) => {
    const targetId = trigger.getAttribute('data-modal-target');
    const modal = getModalById(targetId);
    if (!modal) return;

    trigger.addEventListener('click', () => {
      openModal(modal, trigger);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => closeModal());
  });

  if (overlay) {
    overlay.addEventListener('click', () => closeModal());
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeModal) {
      event.preventDefault();
      closeModal();
    }
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      contactForm.reset();
      closeModal();
    });
  }
};

const initHeaderSearch = () => {
  const searchForm = document.querySelector('.search-panel');
  if (!searchForm) {
    return;
  }

  const searchInput = searchForm.querySelector('.search-field');
  const searchButton = searchForm.querySelector('.search-trigger');
  if (!(searchInput instanceof HTMLInputElement) || !(searchButton instanceof HTMLButtonElement)) {
    return;
  }

  const openSearch = () => {
    if (searchForm.classList.contains('is-active')) return;

    searchForm.classList.add('is-active');
    searchButton.setAttribute('aria-expanded', 'true');
    searchButton.setAttribute('aria-label', 'Submit search query');

    window.requestAnimationFrame(() => {
      searchInput.focus({ preventScroll: true });
    });
  };

  const closeSearch = (returnFocus = false) => {
    if (!searchForm.classList.contains('is-active')) return;

    searchForm.classList.remove('is-active');
    searchButton.setAttribute('aria-expanded', 'false');
    searchButton.setAttribute('aria-label', 'Open site search');
    searchInput.value = '';

    if (returnFocus) {
      searchButton.focus({ preventScroll: true });
    }
  };

  searchButton.addEventListener('click', (event) => {
    if (!searchForm.classList.contains('is-active')) {
      event.preventDefault();
      openSearch();
      return;
    }

    if (!searchInput.value.trim()) {
      event.preventDefault();
      closeSearch(false);
    }
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    closeSearch();
  });

  document.addEventListener('click', (event) => {
    if (!searchForm.classList.contains('is-active')) return;
    const target = event.target;
    if (target instanceof Node && searchForm.contains(target)) {
      return;
    }
    closeSearch();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && searchForm.classList.contains('is-active')) {
      event.preventDefault();
      closeSearch(true);
    }
  });
};

const initSite = () => {
  const bodyEl = document.body;
  const yearField = document.getElementById('year');
  if (yearField) {
    yearField.textContent = new Date().getFullYear();
  }

  bodyEl.classList.add('scroll-animations');

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = { value: reduceMotionQuery.matches };

  initNavigation(bodyEl);
  initModalSystem(bodyEl);
  initializeScrollAnimations();
  initProductGrids(prefersReducedMotion, reduceMotionQuery);
  const scrollTopButton = document.querySelector('.scroll-top');
  initScrollTop(prefersReducedMotion, scrollTopButton);
  initHoverCarousels();
  initExpandableMediaStacks();
  initHeaderSearch();
};

document.addEventListener('DOMContentLoaded', initSite);
