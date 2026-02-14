/* LOADER */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
  }, 1500);
});

/* MOBILE MENU */
function toggleMenu() {
  document.getElementById("nav-menu").classList.toggle("active");
}

/* HERO SLIDER */
const hero = document.querySelector(".hero");
const heroImages = [
  "images/jewellery.jpg",
  "images/watches.jpg",
  "images/perfume.jpg"
];

let heroIndex = 0;

function changeHero() {
  hero.style.backgroundImage = `url('${heroImages[heroIndex]}')`;
  heroIndex = (heroIndex + 1) % heroImages.length;
}
setInterval(changeHero, 4000);
changeHero();

/* SCROLL REVEAL */
function revealOnScroll() {
  document.querySelectorAll(".reveal").forEach(section => {
    const windowHeight = window.innerHeight;
    const elementTop = section.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      section.classList.add("active");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);

/* PROGRESS BAR */
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  document.getElementById("progressBar").style.width = progress + "%";
});

/* MAP MODAL */
function openMap(url) {
  document.getElementById("mapModal").style.display = "flex";
  document.getElementById("mapFrame").src = url;
}

function closeMap() {
  document.getElementById("mapModal").style.display = "none";
  document.getElementById("mapFrame").src = "";
}
