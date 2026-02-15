const container = document.getElementById("productsContainer");

// Get category from URL
function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("category");
}

// Display products
function displayProducts(items) {
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = "<p style='color:white;'>No products found.</p>";
        return;
    }

    items.forEach(product => {
        const productCard = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

// 🔥 NEW: Show Jewellery Sub Categories
function showJewellerySubCategories() {
    container.innerHTML = `
        <div class="product-card">
            <a href="products.html?category=rings" style="text-decoration:none;color:inherit;">
                <img src="images/jewellery.jpg" alt="Rings">
                <h3>Rings</h3>
            </a>
        </div>

        <div class="product-card">
            <a href="products.html?category=bracelets" style="text-decoration:none;color:inherit;">
                <img src="images/jewellery.jpg" alt="Bracelets">
                <h3>Bracelets</h3>
            </a>
        </div>

        <div class="product-card">
            <a href="products.html?category=earrings" style="text-decoration:none;color:inherit;">
                <img src="images/jewellery.jpg" alt="Earrings">
                <h3>Earrings</h3>
            </a>
        </div>
    `;
}

// Filter function (manual button click)
function filterProducts(category) {
    if (category === "all") {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// Auto-load correct category on page open
window.addEventListener("DOMContentLoaded", () => {
    const categoryFromURL = getCategoryFromURL();

    // 👑 SPECIAL CASE FOR JEWELLERY
    if (categoryFromURL === "jewellery") {
        showJewellerySubCategories();
        return;
    }

    if (categoryFromURL) {
        const filtered = products.filter(p => p.category === categoryFromURL);
        displayProducts(filtered);
    } else {
        displayProducts(products);
    }
});
