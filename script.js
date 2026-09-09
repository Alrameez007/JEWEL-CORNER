const SITE_TRANSLATIONS = {
  en: {
    nav_home: "HOME", nav_about: "ABOUT", nav_collections: "COLLECTIONS", nav_branches: "BRANCHES",
    nav_contact: "CONTACT", nav_shop: "Shop Now", hero_title: "LUXURY REDEFINED",
    hero_explore: "EXPLORE COLLECTION", hero_contact: "CONTACT US", welcome_title: "WELCOME TO JEWEL CORNER",
    about_title: "ABOUT US", collection_title: "OUR COLLECTION", branches_title: "BRANCHES (SALALAH)",
    feedback_title: "FEEDBACK", instagram_title: "FOLLOW US ON INSTAGRAM", contact_title: "CONTACT US",
    collection_jewellery: "Jewellery", collection_watches: "Watches", collection_perfumes: "Perfumes",
    collection_souvenirs: "Souvenirs", products_title: "OUR COLLECTION",
    products_intro: "Explore Jewel Corner products and enquire directly on WhatsApp."
  },
  ar: {
    nav_home: "الرئيسية", nav_about: "من نحن", nav_collections: "المجموعات", nav_branches: "الفروع",
    nav_contact: "اتصل بنا", nav_shop: "تسوق الآن", hero_title: "الفخامة بمعنى جديد",
    hero_explore: "استكشف المجموعة", hero_contact: "اتصل بنا", welcome_title: "مرحباً بكم في جويل كورنر",
    about_title: "من نحن", collection_title: "مجموعاتنا", branches_title: "فروعنا في صلالة",
    feedback_title: "آراء العملاء", instagram_title: "تابعونا على إنستغرام", contact_title: "اتصل بنا",
    collection_jewellery: "المجوهرات", collection_watches: "الساعات", collection_perfumes: "العطور",
    collection_souvenirs: "الهدايا التذكارية", products_title: "مجموعاتنا",
    products_intro: "استكشف منتجات جويل كورنر وتواصل معنا مباشرة عبر واتساب."
  }
};

function getCurrentLanguage() {
  return localStorage.getItem("jc_language") || "en";
}

function setLanguage(lang) {
  const chosen = lang === "ar" ? "ar" : "en";
  localStorage.setItem("jc_language", chosen);
  document.documentElement.lang = chosen;
  document.documentElement.dir = chosen === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const value = SITE_TRANSLATIONS[chosen]?.[key];
    if (value) el.textContent = value;
  });
  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === chosen);
  });
  document.dispatchEvent(new CustomEvent("jcLanguageChanged", { detail: { lang: chosen } }));
}

window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;

function initSiteInteractions() {
  const header = document.querySelector("header");
  let lastScrollY = window.scrollY;
  if (header) {
    window.addEventListener("scroll", () => {
      const current = window.scrollY;
      header.classList.toggle("scrolled", current > 50);
      header.classList.toggle("hide-header", current > lastScrollY && current > 100);
      lastScrollY = current;
    }, { passive: true });
  }

  const sections = document.querySelectorAll("section");
  const reveal = () => {
    sections.forEach(section => {
      if (section.getBoundingClientRect().top < window.innerHeight - 80) {
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      }
    });
  };
  sections.forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(28px)";
    section.style.transition = "opacity .7s ease, transform .7s ease";
  });
  window.addEventListener("scroll", reveal, { passive: true });
  reveal();

  setLanguage(getCurrentLanguage());
}

document.addEventListener("DOMContentLoaded", initSiteInteractions);
