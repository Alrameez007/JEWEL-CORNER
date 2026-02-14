// =======================
// PRELOADER
// =======================
window.addEventListener("load", function() {
  document.getElementById("preloader").style.display = "none";
});

// =======================
// NAVBAR SCROLL
// =======================
window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  header.classList.toggle("scrolled", window.scrollY > 50);
});

// =======================
// SCROLL REVEAL
// =======================
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

// =======================
// CUSTOM CURSOR
// =======================
const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");

document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  follower.style.left = e.clientX - 15 + "px";
  follower.style.top = e.clientY - 15 + "px";
});
