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

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {

    toggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
      });
    });

  }

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
/* =========================================================
   JEWEL CORNER — HOMEPAGE LIVE PRODUCT SEARCH
   ========================================================= */

function initHomeProductSearch() {
  const searchInput = document.getElementById("collectionSearch");
  const searchButton = document.getElementById("collectionSearchButton");
  const suggestionsBox = document.getElementById("collectionSearchSuggestions");

  if (
    !searchInput ||
    !searchButton ||
    !suggestionsBox ||
    typeof PRODUCTS === "undefined"
  ) {
    return;
  }

  function currentLanguage() {
    return typeof getCurrentLanguage === "function"
      ? getCurrentLanguage()
      : "en";
  }

  function activeProducts() {
    return PRODUCTS.filter(product => product.status === "active");
  }

  function searchableText(product) {
    return [
      product.id,
      product.sku,
      product.brand,
      product.category,
      product.subcategory,
      product.name?.en,
      product.name?.ar,
      product.description?.en,
      product.description?.ar,
      ...(Array.isArray(product.tags) ? product.tags : [])
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function findProducts(query) {
    const term = query.trim().toLowerCase();

    if (!term) return [];

    return activeProducts()
      .filter(product => searchableText(product).includes(term))
      .slice(0, 8);
  }

  function closeSuggestions() {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.remove("active");
  }

 function productUrl(product) {
  return `products.html?category=${encodeURIComponent(product.category)}&search=${encodeURIComponent(product.id)}&product=${encodeURIComponent(product.id)}`;
}

  function renderSuggestions(query) {
    const language = currentLanguage();
    const results = findProducts(query);

    suggestionsBox.innerHTML = "";

    if (!query.trim()) {
      closeSuggestions();
      return;
    }

    if (!results.length) {
      suggestionsBox.innerHTML = `
        <div class="collection-search-empty">
          ${language === "ar"
            ? "لم يتم العثور على منتجات."
            : "No products found."}
        </div>
      `;

      suggestionsBox.classList.add("active");
      return;
    }

    results.forEach(product => {
      const productName =
        product.name?.[language] ||
        product.name?.en ||
        product.id;

      const result = document.createElement("a");

      result.className = "collection-search-result";
      result.href = productUrl(product);

      result.innerHTML = `
        <img
          src="${product.image}"
          alt="${productName}"
          loading="lazy"
        >

        <span class="collection-search-result-info">
          <span class="collection-search-result-name">
            ${productName}
          </span>

          <span class="collection-search-result-code">
            ${product.id}
          </span>
        </span>
      `;

      suggestionsBox.appendChild(result);
    });

    suggestionsBox.classList.add("active");
  }

  function submitSearch() {
    const query = searchInput.value.trim();

    if (!query) {
      searchInput.focus();
      return;
    }

    const results = findProducts(query);

    if (results.length === 1) {
      window.location.href = productUrl(results[0]);
      return;
    }

    if (results.length > 1) {
      const category = results[0].category || "all";

      window.location.href =
        `products.html?category=${encodeURIComponent(category)}&search=${encodeURIComponent(query)}`;

      return;
    }

    renderSuggestions(query);
  }

  searchInput.addEventListener("input", () => {
    renderSuggestions(searchInput.value);
  });

  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitSearch();
    }

    if (event.key === "Escape") {
      closeSuggestions();
    }
  });

  searchButton.addEventListener("click", submitSearch);

  document.addEventListener("click", event => {
    const wrapper = searchInput.closest(".collection-search-wrapper");

    if (wrapper && !wrapper.contains(event.target)) {
      closeSuggestions();
    }
  });

  document.addEventListener("jcLanguageChanged", () => {
    if (searchInput.value.trim()) {
      renderSuggestions(searchInput.value);
    }
  });
}
/* =========================================================
   JEWEL CORNER — FEATURED PRODUCT SLIDER
   ========================================================= */

function initFeaturedProductSlider() {

  const sliderTrack = document.getElementById("featuredSliderTrack");
  const dotsContainer = document.getElementById("featuredSliderDots");
  const prevButton = document.getElementById("featuredPrev");
  const nextButton = document.getElementById("featuredNext");

  if (
    !sliderTrack ||
    !dotsContainer ||
    !prevButton ||
    !nextButton ||
    typeof PRODUCTS === "undefined"
  ) {
    return;
  }

  const featuredProducts = PRODUCTS.filter(product =>
    product.status === "active" &&
    product.featured === true
  );

  if (!featuredProducts.length) {
    document
      .getElementById("featured-products")
      ?.remove();

    return;
  }

  let currentSlide = 0;
  let sliderTimer = null;

  function getLanguage() {
    return typeof getCurrentLanguage === "function"
      ? getCurrentLanguage()
      : "en";
  }

  function productUrl(product) {
    return (
      `products.html?category=${encodeURIComponent(product.category)}` +
      `&search=${encodeURIComponent(product.id)}` +
      `&product=${encodeURIComponent(product.id)}`
    );
  }

  function renderSlider() {

    const language = getLanguage();

    sliderTrack.innerHTML = "";
    dotsContainer.innerHTML = "";

    featuredProducts.forEach((product, index) => {

      const productName =
        product.name?.[language] ||
        product.name?.en ||
        product.id;

      const description =
        product.description?.[language] ||
        product.description?.en ||
        "";

      const slide = document.createElement("div");

      slide.className =
        `featured-slide${index === currentSlide ? " active" : ""}`;

      slide.innerHTML = `
        <div class="featured-slide-image">

          <a href="${productUrl(product)}">
            <img
              src="${product.image}"
              alt="${productName}"
              loading="${index === 0 ? "eager" : "lazy"}"
            >
          </a>

        </div>

        <div class="featured-slide-content">

          <h3>${productName}</h3>

          <div class="featured-slide-code">
            ${product.id}
          </div>

          <p class="featured-slide-description">
            ${description}
          </p>

          <a
            href="${productUrl(product)}"
            class="featured-slide-button"
          >
            ${language === "ar"
              ? "عرض التفاصيل"
              : "View Details"}
          </a>

        </div>
      `;

      sliderTrack.appendChild(slide);

      const dot = document.createElement("button");

      dot.type = "button";
      dot.className =
        `featured-slider-dot${index === currentSlide ? " active" : ""}`;

      dot.setAttribute(
        "aria-label",
        `Go to product ${index + 1}`
      );

      dot.addEventListener("click", () => {
        currentSlide = index;
        updateSlider();
        restartTimer();
      });

      dotsContainer.appendChild(dot);
    });
  }

  function updateSlider() {

    const slides =
      sliderTrack.querySelectorAll(".featured-slide");

    const dots =
      dotsContainer.querySelectorAll(".featured-slider-dot");

    slides.forEach((slide, index) => {
      slide.classList.toggle(
        "active",
        index === currentSlide
      );
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle(
        "active",
        index === currentSlide
      );
    });
  }

  function nextSlide() {

    currentSlide =
      (currentSlide + 1) %
      featuredProducts.length;

    updateSlider();
  }

  function previousSlide() {

    currentSlide =
      (currentSlide - 1 + featuredProducts.length) %
      featuredProducts.length;

    updateSlider();
  }

  function startTimer() {

    stopTimer();

    if (featuredProducts.length <= 1) {
      return;
    }

    sliderTimer = setInterval(() => {
      nextSlide();
    }, 5000);
  }

  function stopTimer() {

    if (sliderTimer) {
      clearInterval(sliderTimer);
      sliderTimer = null;
    }
  }

  function restartTimer() {
    startTimer();
  }

  nextButton.addEventListener("click", () => {
    nextSlide();
    restartTimer();
  });

  prevButton.addEventListener("click", () => {
    previousSlide();
    restartTimer();
  });

  /* Pause while mouse is over slider */

  sliderTrack.addEventListener("mouseenter", stopTimer);
  sliderTrack.addEventListener("mouseleave", startTimer);

  /* Mobile swipe support */

  let touchStartX = 0;

  sliderTrack.addEventListener(
    "touchstart",
    event => {
      touchStartX =
        event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  sliderTrack.addEventListener(
    "touchend",
    event => {

      const touchEndX =
        event.changedTouches[0].screenX;

      const difference =
        touchStartX - touchEndX;

      if (Math.abs(difference) < 50) {
        return;
      }

      if (difference > 0) {
        nextSlide();
      } else {
        previousSlide();
      }

      restartTimer();
    },
    { passive: true }
  );

  /* Update EN / AR content */

  document.addEventListener(
    "jcLanguageChanged",
    () => {
      renderSlider();
      updateSlider();
    }
  );

  renderSlider();
  startTimer();
}

document.addEventListener("DOMContentLoaded", () => {
  initSiteInteractions();
  initHomeProductSearch();
  initFeaturedProductSlider();
});
