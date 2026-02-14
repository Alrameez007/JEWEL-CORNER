// ============================
// HERO AUTO SLIDER
// ============================
const slides = document.querySelectorAll(".slide");
let index = 0;

function nextSlide() {
  if (slides.length === 0) return; // Safety check
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}

setInterval(nextSlide, 4000);

// ============================
// NAVBAR SCROLL EFFECT
// ============================
window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }
});

// ============================
// SCROLL REVEAL
// ============================
const observerOptions = {
  threshold: 0.2
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, observerOptions);

document.querySelectorAll(".collection-card, .branch-card").forEach(el => {
  observer.observe(el);
});

// ============================
// PAGE TRANSITION (for links)
// ============================
const links = document.querySelectorAll("a");

links.forEach(link => {
  link.addEventListener("click", function(e) {
    const href = this.getAttribute("href");
    if (href && href.startsWith("#")) return; // In-page anchors

    e.preventDefault();
    const pageTransition = document.querySelector(".page-transition");
    if (pageTransition) {
      pageTransition.classList.add("active");
      setTimeout(() => {
        window.location.href = this.href;
      }, 800);
    } else {
      // fallback if .page-transition element doesn't exist
      window.location.href = this.href;
    }
  });
});

// ============================
// BRANCH FILTER
// ============================

function filterBranches(city) {
  const branches = document.querySelectorAll(".branch-card");
  branches.forEach(branch => {
    if (city === "all") {
      branch.style.display = "block";
    } else {
      const branchCity = branch.getAttribute("data-city");
      if (branchCity === city) {
        branch.style.display = "block";
      } else {
        branch.style.display = "none";
      }
    }
  });
}
