// =========================
// DATA SOURCE CONTROLLER
// =========================

let productSource = products;

/* =====================================
   JEWEL CORNER – COMPLETE PRODUCT SYSTEM
===================================== */
const container = document.getElementById("productsContainer");
const pageTitle = document.querySelector(".section-title");
const filterButtons = document.querySelector(".filter-buttons");
const productsSection = document.querySelector(".products-section");

/* ================================
   BREADCRUMB
================================ */

let breadcrumb = document.createElement("div");
breadcrumb.style.color = "white";
breadcrumb.style.marginBottom = "15px";
breadcrumb.style.fontSize = "14px";

productsSection.querySelector(".container").prepend(breadcrumb);

/* ================================
   FADE ANIMATION
================================ */

function fadeContent(callback) {
    container.style.opacity = 0;
    setTimeout(() => {
        callback();
        container.style.opacity = 1;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
}

/* ================================
   DISPLAY PRODUCTS
================================ */

function displayProducts(items) {

    fadeContent(() => {

        // Shimmer loading
        container.innerHTML = "";
        for (let i = 0; i < 6; i++) {
            const shimmer = document.createElement("div");
            shimmer.className = "product-card";
            shimmer.style.height = "250px";
            shimmer.style.background =
                "linear-gradient(90deg,#111 25%,#1a1a1a 50%,#111 75%)";
            shimmer.style.backgroundSize = "200% 100%";
            shimmer.style.animation = "shimmer 1.2s infinite";
            shimmer.style.borderRadius = "10px";
            container.appendChild(shimmer);
        }

        setTimeout(() => {

            container.innerHTML = "";

            if (items.length === 0) {
                container.innerHTML =
                    "<p style='color:white;'>No products found.</p>";
                return;
            }

            items.forEach(product => {

                const card = document.createElement("div");
                card.className = "product-card";
                card.style.cursor = "pointer";
                card.style.transition =
                    "transform 0.3s ease, box-shadow 0.3s ease";
                card.style.position = "relative";

                card.innerHTML = `
                    <div class="wishlist-heart" style="
                        position:absolute;
                        top:10px;
                        right:10px;
                        font-size:20px;
                        cursor:pointer;
                        color:white;
                        transition:0.3s;
                    ">♡</div>

                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                `;

                // Hover glow
                card.addEventListener("mouseenter", () => {
                    card.style.transform = "translateY(-8px)";
                    card.style.boxShadow =
                        "0 20px 40px rgba(255,215,0,0.2)";
                });

                card.addEventListener("mouseleave", () => {
                    card.style.transform = "translateY(0)";
                    card.style.boxShadow = "none";
                });

                // Wishlist toggle
                const heart = card.querySelector(".wishlist-heart");
                heart.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (heart.textContent === "♡") {
                        heart.textContent = "♥";
                        heart.style.color = "gold";
                    } else {
                        heart.textContent = "♡";
                        heart.style.color = "white";
                    }
                });

                // Open modal
                card.addEventListener("click", () => openModal(product));

                container.appendChild(card);
            });

        }, 500);
    });
}

/* Shimmer animation */
const style = document.createElement("style");
style.innerHTML = `
@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}`;
document.head.appendChild(style);
function getActiveProducts() {
    return productSource.filter(product => product.status === "active");
}

/* ================================
   FILTER PRODUCTS
================================ */

function filterProducts(category) {

    if (filterButtons) filterButtons.style.display = "flex";

    if (category === "all") {
        displayProducts(productSource);
        pageTitle.textContent = "Our Collection";
        breadcrumb.innerHTML = "Home / All Products";
    } else {
        const filtered =
            getActiveProducts().filter(p => p.category === category);

        displayProducts(filtered);

        const formatted =
            category.charAt(0).toUpperCase() +
            category.slice(1);

        pageTitle.textContent = formatted;
        breadcrumb.innerHTML = "Home / " + formatted;
    }
   function filterSubcategory(category, subcategory) {
    const filtered = getActiveProducts().filter(p =>
        p.category === category &&
        p.subcategory === subcategory
    );

    displayProducts(filtered);

    const formatted =
        subcategory.charAt(0).toUpperCase() +
        subcategory.slice(1);

    pageTitle.textContent = formatted;
    breadcrumb.innerHTML =
        "Home / " + category + " / " + formatted;
}

}

/* ================================
   CATEGORY FROM URL
================================ */

function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("category");
}
function buildCategorySidebar() {
    const sidebar = document.getElementById("categorySidebar");
    if (!sidebar) return;

    const categories = {};

    getActiveProducts().forEach(product => {
        if (!categories[product.category]) {
            categories[product.category] = new Set();
        }
        categories[product.category].add(product.subcategory);
    });

    sidebar.innerHTML = "";

    for (let category in categories) {

        const wrapper = document.createElement("div");
        wrapper.className = "category-block";

        const title = document.createElement("h3");
        title.textContent =
            category.charAt(0).toUpperCase() +
            category.slice(1);

        title.addEventListener("click", () => {
            wrapper.classList.toggle("category-active");
        });

        const subList = document.createElement("ul");
        subList.className = "subcategory-list";

        categories[category].forEach(sub => {
            const li = document.createElement("li");
            li.textContent =
                sub.charAt(0).toUpperCase() +
                sub.slice(1);

            li.addEventListener("click", () => {
                filterSubcategory(category, sub);
            });

            subList.appendChild(li);
        });

        wrapper.appendChild(title);
        wrapper.appendChild(subList);
        sidebar.appendChild(wrapper);
    }
}

/* ================================
   AUTO LOAD
================================ */

window.addEventListener("DOMContentLoaded", () => {
   
   buildCategorySidebar();

    container.style.transition = "opacity 0.2s ease";

    const categoryFromURL = getCategoryFromURL();

    if (categoryFromURL) {
        filterProducts(categoryFromURL);
    } else {
        filterProducts("all");
    }

    // =========================
    // SEARCH FUNCTIONALITY
    // =========================
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", function () {

            const searchValue = this.value.toLowerCase();

            const filtered = getActiveProducts().filter(product =>
                product.name.toLowerCase().includes(searchValue));

            displayProducts(filtered);
        });
    }

});

/* ================================
   LUXURY PRODUCT MODAL SYSTEM
================================ */

const modal = document.createElement("div");
modal.style.position = "fixed";
modal.style.top = "0";
modal.style.left = "0";
modal.style.width = "100%";
modal.style.height = "100%";
modal.style.background = "rgba(0,0,0,0.8)";
modal.style.display = "none";
modal.style.justifyContent = "center";
modal.style.alignItems = "center";
modal.style.zIndex = "9999";
modal.style.opacity = "0";
modal.style.transition = "opacity 0.3s ease";

modal.innerHTML = `
    <div id="modalContent" style="
        background:#111;
        padding:30px;
        border-radius:12px;
        max-width:400px;
        width:90%;
        text-align:center;
        color:white;
        position:relative;
        transform:scale(0.8);
        transition:transform 0.3s ease;
    ">
        <span id="closeModal" style="
            position:absolute;
            top:10px;
            right:15px;
            cursor:pointer;
            font-size:20px;
            color:gold;
        ">✕</span>

        <img id="modalImage" src="" style="width:100%;border-radius:8px;margin-bottom:15px;">
        <h3 id="modalTitle"></h3>
        <p id="modalPrice" style="color:gold;margin-top:10px;"></p>
    </div>
`;

document.body.appendChild(modal);

function openModal(product) {
    document.getElementById("modalImage").src = product.image;
    document.getElementById("modalTitle").textContent = product.name;
    document.getElementById("modalPrice").textContent = product.price;

    modal.style.display = "flex";
    setTimeout(() => {
        modal.style.opacity = "1";
        document.getElementById("modalContent").style.transform = "scale(1)";
    }, 10);
}

function closeModal() {
    modal.style.opacity = "0";
    document.getElementById("modalContent").style.transform = "scale(0.8)";
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

document.getElementById("closeModal")
    .addEventListener("click", closeModal);

// Swipe to close
let startY = 0;

modal.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
});

modal.addEventListener("touchmove", (e) => {
    const moveY = e.touches[0].clientY;
    if (moveY - startY > 100) closeModal();
});
