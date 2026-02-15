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

    if (categoryFromURL) {
        const filtered = products.filter(p => p.category === categoryFromURL);
        displayProducts(filtered);
    } else {
        displayProducts(products);
    }
});
