# AGENTS.md — Static Website Creation (Codex Instructions)

A dedicated guide for GPT-Codex agents building static websites (portfolios, galleries, small shops).  
Focus: clean, consistent, desktop-first HTML/CSS/JS projects with Vite.

---

## 1) General principles
- Always start **desktop-first**. Mobile adjustments only if requested later.
- Use **plain HTML, CSS, and JavaScript** unless explicitly told otherwise.
- Code must be **clean, indented, and commented** when non-obvious.
- Always keep structure **predictable and consistent**.

---

## 2) Project structure (always create)
```
project/
  src/
    index.html
    css/
      base.css        # resets, variables (colors, typography)
      layout.css      # page scaffolding with Grid/Flex
      components.css  # buttons, nav, cards
      animations.css  # keyframes, reusable animation classes
      utilities.css   # helpers (visually-hidden, spacing)
    js/
      main.js         # bootstrapping, event listeners
      scroll.js       # scroll-triggered animations (IO pattern)
      anim.js         # only if advanced animations requested
    img/              # placeholder images (use locally referenced files)
  vite.config.js
  README.md
  AGENTS.md
```

**Rules:**
- All filenames lowercase-with-hyphens.
- Always include an empty `/img/` and use placeholder images until the user adjusts later.
- Always link CSS and JS properly in `index.html`.

---

## 3) HTML rules
- Use **semantic HTML** whenever possible (`<header>`, `<main>`, `<footer>`, `<section>`).
- Include `alt` text for every image.
- Ensure headings are hierarchical (`h1` → `h2` → `h3`).

---

## 4) CSS rules
- Use **vanilla CSS** in the structure defined above.
- **Grid**: for overall page sections and galleries.
- **Flexbox**: for aligning items inside sections.
- Include a documented **color palette and typography tokens** in `base.css`.
- Add transitions and keyframes to `animations.css`.
- Keep CSS modular (separate base, layout, components, animations, utilities).

---

## 5) JavaScript rules
- Place all code in `src/js/` files.
- Default behavior: lightweight and clean, avoid unnecessary libraries.
- Use **IntersectionObserver** for scroll-triggered animations.  
  Pattern: toggle an `in` class on elements with `[data-animate]` when they enter viewport.
- Smooth scroll to top when creating "Back to Top" button.
- Keep functions small and named clearly.

---

## 6) Animations
- Prefer **CSS transitions/animations** for simple effects (hover, fade, slide).
- Use **IntersectionObserver** for scroll-ins by default.
- Only add GSAP or similar libraries if specifically requested.

---

## 7) Accessibility
- Always include `alt` attributes on `<img>`.
- Ensure color choices meet contrast standards.
- Maintain visible focus states for links and buttons.

---

## 8) Initial deliverable checklist
When creating a new site, Codex must always provide:
1. Folder structure from §2.
2. `index.html` scaffolded with semantic structure.
3. CSS files with tokens in `base.css` (colors, fonts, spacing).
4. Layout in `layout.css` using Grid/Flexbox.
5. Placeholder images in `/img/`.
6. Scroll-trigger pattern in `scroll.js`.
7. Comments in code when logic is non-obvious.
8. Consistent formatting, indentation, and naming.

---

## 9) Out of scope
- Do not install or configure debugging, linting, or formatting tools.
- Do not assume external dependencies unless explicitly requested.
- Do not add SEO, analytics, or deployment setups unless requested.
