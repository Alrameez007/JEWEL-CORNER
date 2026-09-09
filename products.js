(() => {
  "use strict";

  const productSource =
    typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)
      ? PRODUCTS
      : Array.isArray(window.PRODUCTS)
      ? window.PRODUCTS
      : [];

  const container = document.getElementById("productsContainer");
  const sidebar = document.getElementById("categorySidebar");
  const breadcrumb = document.getElementById("breadcrumb");
  const searchInput = document.getElementById("productSearch");
  const productCount = document.getElementById("productCount");
  const categoryTitle = document.getElementById("categoryTitle");

  const modal = document.getElementById("productModal");
  const modalClose = document.getElementById("modalClose");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalCode = document.getElementById("modalCode");
  const modalBrand = document.getElementById("modalBrand");
  const modalDescription = document.getElementById("modalDescription");
  const modalPrice = document.getElementById("modalPrice");
  const modalActions = document.getElementById("modalActions");

  const params = new URLSearchParams(window.location.search);

  let selectedCategory = params.get("category") || "all";
  let selectedSubcategory = params.get("subcategory") || "all";
  let searchTerm = params.get("search") || "";

  const LABELS = {
    en: {
      allProducts: "All Products",
      categories: "Categories",

      jewellery: "Jewellery",
      watches: "Watches",
      perfume: "Perfumes",
      perfumes: "Perfumes",
      souvenir: "Souvenirs",
      souvenirs: "Souvenirs",

      bracelets: "Bracelets",
      rings: "Rings",
      necklaces: "Necklaces",
      earrings: "Earrings",
      bangles: "Bangles",
      chains: "Chains",
      anklets: "Anklets",

      product: "product",
      products: "products",

      details: "View Details",
      enquire: "Enquire on WhatsApp",
      priceOnEnquiry: "Price on enquiry",
      noProducts: "No products found.",

      code: "Product ID",
      brand: "Brand",
      home: "Home",
      searchPlaceholder: "Search products..."
    },

    ar: {
      allProducts: "جميع المنتجات",
      categories: "الفئات",

      jewellery: "المجوهرات",
      watches: "الساعات",
      perfume: "العطور",
      perfumes: "العطور",
      souvenir: "الهدايا التذكارية",
      souvenirs: "الهدايا التذكارية",

      bracelets: "الأساور",
      rings: "الخواتم",
      necklaces: "القلائد",
      earrings: "الأقراط",
      bangles: "الأساور الصلبة",
      chains: "السلاسل",
      anklets: "الخلاخيل",

      product: "منتج",
      products: "منتجات",

      details: "عرض التفاصيل",
      enquire: "استفسر عبر واتساب",
      priceOnEnquiry: "السعر عند الاستفسار",
      noProducts: "لم يتم العثور على منتجات.",

      code: "رقم المنتج",
      brand: "العلامة التجارية",
      home: "الرئيسية",
      searchPlaceholder: "ابحث عن المنتجات..."
    }
  };

  function getLanguage() {
    if (typeof window.getCurrentLanguage === "function") {
      return window.getCurrentLanguage();
    }

    return localStorage.getItem("jc_language") || "en";
  }

  function t(key) {
    const language = getLanguage();

    return LABELS[language]?.[key] || LABELS.en[key] || key;
  }

  function labelFor(value) {
    if (!value) return "";

    const translated = t(value);

    if (translated !== value) {
      return translated;
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function getActiveProducts() {
    return productSource.filter(
      product => product && product.status === "active"
    );
  }

  function getFilteredProducts() {
    let items = getActiveProducts();

    if (selectedCategory !== "all") {
      items = items.filter(
        product => product.category === selectedCategory
      );
    }

    if (selectedSubcategory !== "all") {
      items = items.filter(
        product => product.subcategory === selectedSubcategory
      );
    }

    if (searchTerm) {
      const query = searchTerm.toLowerCase();

      items = items.filter(product => {
        const values = [
          product.id,
          product.sku,
          product.brand,
          product.category,
          product.subcategory,

          product.name?.en,
          product.name?.ar,

          product.description?.en,
          product.description?.ar,

          Array.isArray(product.tags)
            ? product.tags.join(" ")
            : ""
        ];

        return values.some(value =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );
      });
    }

    return items;
  }

  function updateProductCount(count) {
    if (!productCount) return;

    productCount.textContent =
      `${count} ${count === 1 ? t("product") : t("products")}`;
  }

  function updateBreadcrumb() {
    if (!breadcrumb) return;

    const parts = [
      `<a href="index.html">${t("home")}</a>`
    ];

    if (selectedCategory === "all") {
      parts.push(t("allProducts"));
    } else {
      parts.push(labelFor(selectedCategory));
    }

    if (selectedSubcategory !== "all") {
      parts.push(labelFor(selectedSubcategory));
    }

    breadcrumb.innerHTML = parts.join(" / ");
  }

  function updateCategoryTitle() {
    if (!categoryTitle) return;

    if (selectedSubcategory !== "all") {
      categoryTitle.textContent =
        labelFor(selectedSubcategory).toUpperCase();
    } else if (selectedCategory !== "all") {
      categoryTitle.textContent =
        labelFor(selectedCategory).toUpperCase();
    } else {
      categoryTitle.textContent =
        t("allProducts").toUpperCase();
    }
  }

  function createWhatsAppUrl(product) {
  const language = getLanguage();

  const productName =
    product.name?.[language] ||
    product.name?.en ||
    product.id;

  const message =
    language === "ar"
      ? `مرحباً جويل كورنر، أود الاستفسار عن المنتج ${product.id} - ${productName}`
      : `Hello Jewel Corner, I would like to enquire about ${product.id} - ${productName}`;

  const phone = "96877147645";

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}
  
  function openModal(product) {
    if (!modal) return;

    const language = getLanguage();

    const name =
      product.name?.[language] ||
      product.name?.en ||
      product.id;

    const description =
      product.description?.[language] ||
      product.description?.en ||
      "";

    if (modalImage) {
      modalImage.src = product.image || "";
      modalImage.alt = name;
    }

    if (modalTitle) {
      modalTitle.textContent = name;
    }

    if (modalCode) {
      modalCode.textContent =
        `${t("code")}: ${product.id}`;
    }

    if (modalBrand) {
      modalBrand.textContent =
        product.brand
          ? `${t("brand")}: ${product.brand}`
          : "";
    }

    if (modalDescription) {
      modalDescription.textContent = description;
    }

    if (modalPrice) {
      if (
        product.showPrice === true &&
        product.price !== "" &&
        product.price !== null &&
        product.price !== undefined
      ) {
        modalPrice.innerHTML =
          `<p class="price">OMR ${Number(product.price).toFixed(3)}</p>`;
      } else {
        modalPrice.innerHTML =
          `<p class="price-hidden">${t("priceOnEnquiry")}</p>`;
      }
    }

    if (modalActions) {
      modalActions.innerHTML =
        product.whatsappEnquiry
          ? `
            <a
              class="whatsapp-btn"
              href="${createWhatsAppUrl(product)}"
              target="_blank"
              rel="noopener"
            >
              ${t("enquire")}
            </a>
          `
          : "";
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
  }

  function renderProducts() {
    if (!container) return;

    const items = getFilteredProducts();

    container.innerHTML = "";

    if (!items.length) {
      container.innerHTML =
        `<div class="empty-state">${t("noProducts")}</div>`;

      updateProductCount(0);
      updateBreadcrumb();
      updateCategoryTitle();

      return;
    }

    items.forEach(product => {
      const language = getLanguage();

      const name =
        product.name?.[language] ||
        product.name?.en ||
        product.id;

      let priceHtml = "";

      if (
        product.showPrice === true &&
        product.price !== "" &&
        product.price !== null &&
        product.price !== undefined
      ) {
        priceHtml =
          `<p class="price">OMR ${Number(product.price).toFixed(3)}</p>`;
      } else {
        priceHtml =
          `<p class="price-hidden">${t("priceOnEnquiry")}</p>`;
      }

      const newBadge =
        product.newArrival
          ? `
            <span class="product-badge">
              ${language === "ar" ? "جديد" : "NEW"}
            </span>
          `
          : "";

      const card = document.createElement("article");

      card.className = "catalog-card";

      card.innerHTML = `
        <div class="catalog-image-wrap">
          ${newBadge}

          <img
            src="${product.image || ""}"
            alt="${name}"
            loading="lazy"
          >
        </div>

        <h3>${name}</h3>

        <p class="product-code">
          ${t("code")}: ${product.id}
        </p>

        ${priceHtml}

        <div class="catalog-actions">

          <button
            type="button"
            class="details-btn"
          >
            ${t("details")}
          </button>

          ${
            product.whatsappEnquiry
              ? `
                <a
                  class="whatsapp-btn"
                  href="${createWhatsAppUrl(product)}"
                  target="_blank"
                  rel="noopener"
                >
                  ${t("enquire")}
                </a>
              `
              : ""
          }

        </div>
      `;

      const detailsButton =
        card.querySelector(".details-btn");

      const imageWrap =
        card.querySelector(".catalog-image-wrap");

      if (detailsButton) {
        detailsButton.addEventListener(
          "click",
          () => openModal(product)
        );
      }

      if (imageWrap) {
        imageWrap.addEventListener(
          "click",
          () => openModal(product)
        );
      }

      container.appendChild(card);
    });

    updateProductCount(items.length);
    updateBreadcrumb();
    updateCategoryTitle();
  }

  function buildSidebar() {
    if (!sidebar) return;

    const products = getActiveProducts();

    const categories = [
      ...new Set(
        products
          .map(product => product.category)
          .filter(Boolean)
      )
    ];

    let html = `
      <h3>${t("categories")}</h3>

      <ul class="category-list">
    `;

    html += `
      <li>

        <button
          type="button"
          class="category-button ${
            selectedCategory === "all"
              ? "active"
              : ""
          }"
          data-category="all"
        >

          ${t("allProducts")}

        </button>

      </li>
    `;

    categories.forEach(category => {
      const subcategories = [
        ...new Set(
          products
            .filter(
              product =>
                product.category === category
            )
            .map(
              product =>
                product.subcategory
            )
            .filter(Boolean)
        )
      ];

      html += `
        <li>

          <button
            type="button"
            class="category-button ${
              selectedCategory === category &&
              selectedSubcategory === "all"
                ? "active"
                : ""
            }"
            data-category="${category}"
          >

            ${labelFor(category)}

          </button>
      `;

      if (subcategories.length) {
        html += `<ul class="subcategory-list">`;

        subcategories.forEach(subcategory => {
          html += `
            <li>

              <button
                type="button"
                class="subcategory-button ${
                  selectedCategory === category &&
                  selectedSubcategory === subcategory
                    ? "active"
                    : ""
                }"
                data-category="${category}"
                data-subcategory="${subcategory}"
              >

                ${labelFor(subcategory)}

              </button>

            </li>
          `;
        });

        html += `</ul>`;
      }

      html += `</li>`;
    });

    html += `</ul>`;

    sidebar.innerHTML = html;

    const categoryButtons =
      sidebar.querySelectorAll(".category-button");

    categoryButtons.forEach(button => {
      button.addEventListener("click", () => {
        selectedCategory =
          button.dataset.category || "all";

        selectedSubcategory = "all";

        updateUrl();

        buildSidebar();

        renderProducts();
      });
    });

    const subcategoryButtons =
      sidebar.querySelectorAll(".subcategory-button");

    subcategoryButtons.forEach(button => {
      button.addEventListener("click", () => {
        selectedCategory =
          button.dataset.category || "all";

        selectedSubcategory =
          button.dataset.subcategory || "all";

        updateUrl();

        buildSidebar();

        renderProducts();
      });
    });
  }

  function updateUrl() {
    const newParams = new URLSearchParams();

    if (selectedCategory !== "all") {
      newParams.set(
        "category",
        selectedCategory
      );
    }

    if (selectedSubcategory !== "all") {
      newParams.set(
        "subcategory",
        selectedSubcategory
      );
    }

    const url =
      newParams.toString()
        ? `products.html?${newParams.toString()}`
        : "products.html";

    window.history.replaceState(
      {},
      "",
      url
    );
  }

  function refreshLanguage() {
    if (searchInput) {
      searchInput.placeholder =
        t("searchPlaceholder");
    }

    buildSidebar();

    renderProducts();
  }

  if (searchInput) {

  searchInput.value = searchTerm;

  searchInput.addEventListener(
    "input",
    event => {

      searchTerm =
        event.target.value
          .trim();

      renderProducts();

    }
  );
}

  if (modalClose) {
    modalClose.addEventListener(
      "click",
      closeModal
    );
  }

  if (modal) {
    modal.addEventListener(
      "click",
      event => {
        if (event.target === modal) {
          closeModal();
        }
      }
    );
  }

  document.addEventListener(
    "keydown",
    event => {
      if (event.key === "Escape") {
        closeModal();
      }
    }
  );

  document.addEventListener(
    "jcLanguageChanged",
    refreshLanguage
  );

  if (!productSource.length) {
    console.error(
      "Jewel Corner: no products loaded. Check products-data.js."
    );
  }

  refreshLanguage();

})();
