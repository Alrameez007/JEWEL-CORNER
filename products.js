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

document.getElementById("closeModal").addEventListener("click", closeModal);
