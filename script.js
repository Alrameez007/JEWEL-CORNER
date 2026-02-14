/* ============================= */
/* MOBILE MENU TOGGLE */
/* ============================= */

function toggleMenu() {
  const nav = document.getElementById("nav-menu");
  nav.classList.toggle("active");
}


/* ============================= */
/* LANGUAGE TOGGLE (EN ↔ AR) */
/* ============================= */

let currentLang = "en";

function toggleLanguage() {
  const htmlTag = document.documentElement;
  const langBtn = document.querySelector(".lang-btn");

  if (currentLang === "en") {
    // Switch to Arabic
    htmlTag.lang = "ar";
    htmlTag.dir = "rtl";

    document.querySelector("#hero h1").innerText = "الفخامة. الأناقة. جمال لا يزول.";
    document.querySelector("#hero p").innerText =
      "وجهتك المميزة في صلالة للمجوهرات والساعات والعطور والهدايا.";

    document.querySelector(".primary-btn").innerText = "زوروا فروعنا";
    document.querySelector(".secondary-btn").innerText = "تواصل عبر واتساب";

    document.querySelector("#collections h2").innerText = "مجموعاتنا";
    document.querySelectorAll(".card h3")[0].innerText = "المجوهرات";
    document.querySelectorAll(".card h3")[1].innerText = "الساعات";
    document.querySelectorAll(".card h3")[2].innerText = "العطور";
    document.querySelectorAll(".card h3")[3].innerText = "الهدايا";

    document.querySelector("#branches h2").innerText = "فروعنا الحصرية";

    document.querySelectorAll(".direction-btn").forEach(btn => {
      btn.innerText = "الاتجاهات";
    });

    document.querySelector("#contact h2").innerText = "تواصل معنا";
    document.querySelector("#contact p").innerText =
      "الهاتف / واتساب: +968 77147645";

    document.querySelector("nav ul li:nth-child(1) a").innerText = "الرئيسية";
    document.querySelector("nav ul li:nth-child(2) a").innerText = "المجموعات";
    document.querySelector("nav ul li:nth-child(3) a").innerText = "الفروع";
    document.querySelector("nav ul li:nth-child(4) a").innerText = "اتصل بنا";

    langBtn.innerText = "English";

    currentLang = "ar";

  } else {
    // Switch back to English
    htmlTag.lang = "en";
    htmlTag.dir = "ltr";

    document.querySelector("#hero h1").innerText =
      "Luxury. Elegance. Timeless Beauty.";
    document.querySelector("#hero p").innerText =
      "Salalah’s premium destination for jewellery, watches, perfumes and souvenirs.";

    document.querySelector(".primary-btn").innerText = "Visit Our Branches";
    document.querySelector(".secondary-btn").innerText = "Chat on WhatsApp";

    document.querySelector("#collections h2").innerText = "Our Collections";
    document.querySelectorAll(".card h3")[0].innerText = "Jewellery";
    document.querySelectorAll(".card h3")[1].innerText = "Watches";
    document.querySelectorAll(".card h3")[2].innerText = "Perfumes";
    document.querySelectorAll(".card h3")[3].innerText = "Souvenirs";

    document.querySelector("#branches h2").innerText =
      "Our Exclusive Boutiques";

    document.querySelectorAll(".direction-btn").forEach(btn => {
      btn.innerText = "Get Directions";
    });

    document.querySelector("#contact h2").innerText = "Contact Us";
    document.querySelector("#contact p").innerText =
      "Phone / WhatsApp: +968 77147645";

    document.querySelector("nav ul li:nth-child(1) a").innerText = "Home";
    document.querySelector("nav ul li:nth-child(2) a").innerText = "Collections";
    document.querySelector("nav ul li:nth-child(3) a").innerText = "Branches";
    document.querySelector("nav ul li:nth-child(4) a").innerText = "Contact";

    langBtn.innerText = "العربية";

    currentLang = "en";
  }
}


/* ============================= */
/* SCROLL REVEAL ANIMATION */
/* ============================= */

function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");

  reveals.forEach(section => {
    const windowHeight = window.innerHeight;
    const elementTop = section.getBoundingClientRect().top;
    const revealPoint = 100;

    if (elementTop < windowHeight - revealPoint) {
      section.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);


/* ============================= */
/* SCROLL PROGRESS BAR */
/* ============================= */

window.addEventListener("scroll", function () {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const progress = (scrollTop / scrollHeight) * 100;
  document.getElementById("progressBar").style.width = progress + "%";
});


/* ============================= */
/* CLOSE MOBILE MENU ON CLICK */
/* ============================= */

document.querySelectorAll("#nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("nav-menu").classList.remove("active");
  });
});


/* ============================= */
/* INITIAL LOAD */
/* ============================= */

document.addEventListener("DOMContentLoaded", () => {
  revealOnScroll();
});
