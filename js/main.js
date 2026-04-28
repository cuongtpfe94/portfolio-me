/**
 * Portfolio — Three.js hero, Intersection Observer scroll reveal, micro-interactions
 */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Year in footer */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Mobile nav */
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav a");

  function closeNav() {
    header.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (navToggle && header) {
    navToggle.addEventListener("click", () => {
      header.classList.toggle("is-open");
      document.body.style.overflow = header.classList.contains("is-open") ? "hidden" : "";
    });
    navLinks.forEach((link) => {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("click", (e) => {
      if (!header.classList.contains("is-open")) return;
      const t = e.target;
      if (t instanceof Node && !header.contains(t)) closeNav();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* Intersection Observer — reveal on scroll */
  const revealEls = document.querySelectorAll(".reveal");
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* Tech stack chips — show hint */
  const hintEl = document.getElementById("stack-hint");
  const chips = document.querySelectorAll(".tech-chip");
  chips.forEach((chip) => {
    chip.addEventListener("mouseenter", () => {
      const hint = chip.getAttribute("data-hint") || chip.textContent;
      if (hintEl) hintEl.textContent = hint;
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
    });
    chip.addEventListener("focus", () => {
      const hint = chip.getAttribute("data-hint") || chip.textContent;
      if (hintEl) hintEl.textContent = hint;
    });
  });

  /* Contact form — demo only */
  const form = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (formNote) {
        formNote.hidden = false;
        formNote.textContent =
          "Cảm ơn bạn! Đây là bản demo — hãy thêm backend hoặc dịch vụ form để gửi email thật.";
      }
      form.reset();
    });
  }

  /* Three.js — lightweight wireframe + subtle mouse parallax */
  const canvasMount = document.getElementById("hero-canvas");
  const canRunThree =
    canvasMount && !prefersReducedMotion && typeof THREE !== "undefined";

  if (canvasMount && prefersReducedMotion) canvasMount.style.display = "none";

  if (!canRunThree) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 4.2;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const group = new THREE.Group();
  scene.add(group);

  const geo = new THREE.IcosahedronGeometry(1.15, 1);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });
  const mesh = new THREE.Mesh(geo, mat);
  group.add(mesh);

  const innerGeo = new THREE.TorusGeometry(0.55, 0.12, 12, 48);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xa78bfa,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
  });
  const torus = new THREE.Mesh(innerGeo, innerMat);
  torus.rotation.x = Math.PI / 3;
  group.add(torus);

  function resize() {
    const w = canvasMount.clientWidth;
    const h = canvasMount.clientHeight;
    camera.aspect = w / h || 1;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  canvasMount.appendChild(renderer.domElement);
  resize();

  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  window.addEventListener(
    "mousemove",
    (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX = nx * 0.35;
      mouseY = ny * 0.25;
    },
    { passive: true }
  );

  window.addEventListener("resize", resize);

  function animate() {
    requestAnimationFrame(animate);
    targetRotX += (mouseY * 0.4 - targetRotX) * 0.04;
    targetRotY += (mouseX * 0.5 - targetRotY) * 0.04;

    group.rotation.x += 0.0025 + targetRotX * 0.02;
    group.rotation.y += 0.004 + targetRotY * 0.02;
    torus.rotation.z += 0.008;

    renderer.render(scene, camera);
  }
  animate();
})();
