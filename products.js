(() => {
  const PHONE = "96877147645";
  const categoryLabels = {
    jewellery: { en: "Jewellery", ar: "المجوهرات" },
    watches: { en: "Watches", ar: "الساعات" },
    perfume: { en: "Perfumes", ar: "العطور" },
    souvenir: { en: "Souvenirs", ar: "الهدايا التذكارية" }
  };
  const subcategoryLabels = {
    bracelets: { en: "Bracelets", ar: "الأساور" },
    rings: { en: "Rings", ar: "الخواتم" },
    necklaces: { en: "Necklaces", ar: "العقود" },
    earrings: { en: "Earrings", ar: "الأقراط" },
    bangles: { en: "Bangles", ar: "البناجر" },
    chains: { en: "Chains", ar: "السلاسل" }
  };
  const ui = {
    en: { all:"All Products", categories:"Categories", search:"Search products...", products:"products", noProducts:"No products found.", details:"View Details", enquire:"Enquire on WhatsApp", priceOnEnquiry:"Price on enquiry", productCode:"Product ID", brand:"Brand", home:"Home", newArrival:"New Arrival" },
    ar: { all:"جميع المنتجات", categories:"الفئات", search:"ابحث عن المنتجات...", products:"منتج", noProducts:"لم يتم العثور على منتجات.", details:"عرض التفاصيل", enquire:"استفسر عبر واتساب", priceOnEnquiry:"السعر عند الاستفسار", productCode:"رقم المنتج", brand:"العلامة التجارية", home:"الرئيسية", newArrival:"وصل حديثاً" }
  };

  const container = document.getElementById("productsContainer");
  if (!container || typeof PRODUCTS === "undefined") return;

  const sidebar = document.getElementById("categorySidebar");
  const search = document.getElementById("productSearch");
  const count = document.getElementById("productCount");
  const breadcrumb = document.getElementById("breadcrumb");
  const categoryTitle = document.getElementById("categoryTitle");
  const modal = document.getElementById("productModal");
  const modalClose = document.getElementById("modalClose");

  const normalizeCategory = value => ({ perfumes:"perfume", souvenirs:"souvenir" }[value] || value);
  const params = new URLSearchParams(location.search);
  let selectedCategory = normalizeCategory(params.get("category")) || "all";
  let selectedSubcategory = "all";
  let query = "";
  let activeModalProduct = null;

  const lang = () => window.getCurrentLanguage ? window.getCurrentLanguage() : "en";
  const label = (map, key) => map[key]?.[lang()] || key;
  const activeProducts = () => PRODUCTS.filter(p => p.status === "active");

  function filteredProducts() {
    return activeProducts().filter(p => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (selectedSubcategory !== "all" && p.subcategory !== selectedSubcategory) return false;
      if (query) {
        const hay = [p.id, p.name?.en, p.name?.ar, p.brand, p.sku, p.category, p.subcategory, ...(p.tags || [])].join(" ").toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }

  function whatsappLink(product) {
    const L = lang();
    const message = L === "ar"
      ? `مرحباً جويل كورنر، أود الاستفسار عن المنتج ${product.id} - ${product.name.ar || product.name.en}`
      : `Hello Jewel Corner, I would like to enquire about ${product.id} - ${product.name.en}`;
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  }

  function renderSidebar() {
    const L = lang();
    const products = activeProducts();
    const categories = [...new Set(products.map(p => p.category))];
    sidebar.innerHTML = `<h3>${ui[L].categories}</h3><ul class="category-list"></ul>`;
    const list = sidebar.querySelector(".category-list");

    const allLi = document.createElement("li");
    allLi.innerHTML = `<button class="category-button ${selectedCategory === "all" ? "active" : ""}" data-category="all">${ui[L].all}</button>`;
    list.appendChild(allLi);

    categories.forEach(cat => {
      const li = document.createElement("li");
      const subs = [...new Set(products.filter(p => p.category === cat).map(p => p.subcategory).filter(Boolean))];
      li.innerHTML = `<button class="category-button ${selectedCategory === cat && selectedSubcategory === "all" ? "active" : ""}" data-category="${cat}">${label(categoryLabels, cat)}</button>`;
      if (subs.length) {
        const ul = document.createElement("ul"); ul.className = "subcategory-list";
        subs.forEach(sub => {
          const s = document.createElement("li");
          s.innerHTML = `<button class="subcategory-button ${selectedSubcategory === sub ? "active" : ""}" data-category="${cat}" data-subcategory="${sub}">${label(subcategoryLabels, sub)}</button>`;
          ul.appendChild(s);
        });
        li.appendChild(ul);
      }
      list.appendChild(li);
    });

    sidebar.querySelectorAll("[data-category]").forEach(btn => btn.addEventListener("click", () => {
      selectedCategory = btn.dataset.category;
      selectedSubcategory = btn.dataset.subcategory || "all";
      const url = new URL(location.href);
      if (selectedCategory === "all") url.searchParams.delete("category"); else url.searchParams.set("category", selectedCategory);
      history.replaceState({}, "", url);
      renderAll();
    }));
  }

  function renderCards() {
    const L = lang();
    const items = filteredProducts();
    count.textContent = `${items.length} ${ui[L].products}`;
    container.innerHTML = "";
    if (!items.length) {
      container.innerHTML = `<div class="empty-state">${ui[L].noProducts}</div>`;
      return;
    }
    items.forEach(product => {
      const card = document.createElement("article"); card.className = "catalog-card";
      const productName = product.name?.[L] || product.name?.en || product.id;
      const price = product.showPrice && product.price !== null && product.price !== undefined
        ? `<div class="price">OMR ${Number(product.price).toFixed(3)}</div>`
        : `<div class="price-hidden">${ui[L].priceOnEnquiry}</div>`;
      card.innerHTML = `
        <div class="catalog-image-wrap">
          <img src="${product.image}" alt="${productName}">
          ${product.newArrival ? `<span class="product-badge">${ui[L].newArrival}</span>` : ""}
        </div>
        <h3>${productName}</h3>
        <p class="product-code">${ui[L].productCode}: ${product.id}</p>
        ${price}
        <div class="catalog-actions">
          <button type="button" class="details-btn">${ui[L].details}</button>
          ${product.whatsappEnquiry ? `<a class="whatsapp-btn" target="_blank" rel="noopener" href="${whatsappLink(product)}">${ui[L].enquire}</a>` : ""}
        </div>`;
      card.querySelector(".details-btn").addEventListener("click", () => openModal(product));
      container.appendChild(card);
    });
  }

  function renderBreadcrumb() {
    const L = lang();
    const parts = [`<a href="index.html">${ui[L].home}</a>`, `<span>${ui[L].all}</span>`];
    if (selectedCategory !== "all") parts[1] = `<span>${label(categoryLabels, selectedCategory)}</span>`;
    if (selectedSubcategory !== "all") parts.push(`<span>${label(subcategoryLabels, selectedSubcategory)}</span>`);
    breadcrumb.innerHTML = parts.join(" &nbsp;/&nbsp; ");
    if (selectedCategory !== "all") categoryTitle.textContent = label(categoryLabels, selectedCategory).toUpperCase();
    else categoryTitle.textContent = SITE_TRANSLATIONS[L].products_title;
  }

  function openModal(product) {
    const L = lang(); activeModalProduct = product;
    document.getElementById("modalImage").src = product.image;
    document.getElementById("modalImage").alt = product.name?.[L] || product.name.en;
    document.getElementById("modalTitle").textContent = product.name?.[L] || product.name.en;
    document.getElementById("modalCode").textContent = `${ui[L].productCode}: ${product.id}`;
    document.getElementById("modalBrand").textContent = product.brand ? `${ui[L].brand}: ${product.brand}` : "";
    document.getElementById("modalDescription").textContent = product.description?.[L] || product.description?.en || "";
    document.getElementById("modalPrice").innerHTML = product.showPrice && product.price !== null && product.price !== undefined
      ? `<strong>OMR ${Number(product.price).toFixed(3)}</strong>` : `<span>${ui[L].priceOnEnquiry}</span>`;
    document.getElementById("modalActions").innerHTML = product.whatsappEnquiry
      ? `<a class="whatsapp-btn" target="_blank" rel="noopener" href="${whatsappLink(product)}">${ui[L].enquire}</a>` : "";
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); activeModalProduct = null; }
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  search.addEventListener("input", e => { query = e.target.value.trim(); renderCards(); });

  function renderAll() {
    const L = lang();
    search.placeholder = ui[L].search;
    renderSidebar(); renderBreadcrumb(); renderCards();
    if (activeModalProduct) openModal(activeModalProduct);
  }

  document.addEventListener("jcLanguageChanged", renderAll);
  renderAll();
})();
