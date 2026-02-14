// ============================
// HERO AUTO SLIDER
// ============================
let slides = document.querySelectorAll(".slide");
let index = 0;

function nextSlide() {
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
  header.classList.toggle("scrolled", window.scrollY > 50);
});

// ============================
// SCROLL REVEAL
// ============================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
},{threshold: 0.2});

document.querySelectorAll(".collection-card, .branch-card").forEach(el => {
  observer.observe(el);
});

// ============================
// PAGE TRANSITION (for links)
// ============================
const links = document.querySelectorAll("a");

links.forEach(link => {
  link.addEventListener("click", function(e) {
    if(this.getAttribute("href").startsWith("#")) return;

    e.preventDefault();
    document.querySelector(".page-transition").classList.add("active");

    setTimeout(() => {
      window.location = this.href;
    }, 800);
  });
});
