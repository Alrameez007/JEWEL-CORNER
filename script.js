document.addEventListener("DOMContentLoaded", function () {

  /* ===============================
     MOBILE MENU TOGGLE
  =============================== */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

  /* ===============================
     HEADER GLOW ON SCROLL
  =============================== */
  const header = document.querySelector("header");

  window.addEventListener("scroll", function () {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 50);
    }
  });

  /* ===============================
     SMOOTH SECTION REVEAL
  =============================== */
  const sections = document.querySelectorAll("section");

  sections.forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(40px)";
    section.style.transition = "all 0.8s ease";
  });

  function revealSections() {
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      }
    });
  }

  window.addEventListener("scroll", revealSections);
  revealSections(); // Trigger on load

  /* ===============================
     PREMIUM CARD TILT EFFECT
  =============================== */
  const cards = document.querySelectorAll(".product-card");

  cards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = (x / rect.width - 0.5) * 15;
      const rotateX = (y / rect.height - 0.5) * -15;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0) rotateY(0)";
    });
  });

});
