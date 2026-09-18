import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
  } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyDmbLQ4xm_RrNBegPIFY7UdhSR_eMDlTq4",
  authDomain: "jewel-corner-admin.firebaseapp.com",
  projectId: "jewel-corner-admin",
  storageBucket: "jewel-corner-admin.firebasestorage.app",
  messagingSenderId: "886169365350",
  appId: "1:886169365350:web:5d0d432f11f87a61bb36a7"
};


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const IMAGEKIT_PUBLIC_KEY = "public_IP8REy3fRyTC90DJn9RFhDpalck=";

const IMAGEKIT_AUTH_ENDPOINT =
    "https://jewel-corner-image-auth.sideekalrameez.workers.dev/";


/* =========================================================
   PAGE ELEMENTS
   ========================================================= */

const loginPage =
  document.getElementById("loginPage");

const dashboardPage =
  document.getElementById("dashboardPage");

const loginForm =
  document.getElementById("loginForm");

const adminEmail =
  document.getElementById("adminEmail");

const adminPassword =
  document.getElementById("adminPassword");

const loginButton =
  document.getElementById("loginButton");

const loginMessage =
  document.getElementById("loginMessage");

const logoutButton =
  document.getElementById("logoutButton");

/* =========================================================
   APPROVED ADMIN USERS
   ========================================================= */

const APPROVED_ADMIN_UIDS = [
  "u5sLYUqgcGh5fRkVk6P8GADLgiz1",
  "y6R1ZQxKzKZaGoDULlg4zSqNocN2"
];

/* =========================================================
   LOGIN
   ========================================================= */

loginForm.addEventListener(
  "submit",
  async event => {
    event.preventDefault();
    loginMessage.textContent = "";
    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";
    try {
      await signInWithEmailAndPassword(
        auth,
        adminEmail.value.trim(),
        adminPassword.value
      );
      loginMessage.textContent = "";
    } catch (error) {
      console.error(error);
      loginMessage.textContent =
        "Invalid email or password.";
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "Login";
    }
  }
);


/* =========================================================
   LOGOUT
   ========================================================= */

logoutButton.addEventListener(
  "click",
  async () => {
    try {
      await signOut(auth);
    } 
    catch (error) {

      console.error(error);
    }
  }
);

/* =========================================================
   AUTO LOGOUT AFTER 10 MINUTES OF INACTIVITY
   ========================================================= */

const INACTIVITY_LIMIT = 10 * 60 * 1000;

let inactivityTimer;
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  if (!auth.currentUser) {
    return;
  }
  inactivityTimer = setTimeout(
    async () => {
      try {
        await signOut(auth);
        console.log(
          "Logged out automatically due to inactivity."
        );
      } catch (error) {
        console.error(
          "Automatic logout failed:",
          error
        );
      }
    },
    
    INACTIVITY_LIMIT
  );
}


/* Reset timer whenever the admin is active */

[
  "mousemove",
  "mousedown",
  "keydown",
  "click",
  "scroll",
  "touchstart"
].forEach(eventName => {

  document.addEventListener(
    eventName,
    resetInactivityTimer,
    { passive: true }
  );

});

/* =========================================================
   AUTH STATE
   ========================================================= */

onAuthStateChanged(
  auth,
  async user => {

    if (user) {

      const isApprovedAdmin =
        APPROVED_ADMIN_UIDS.includes(user.uid);

      if (!isApprovedAdmin) {

        await signOut(auth);

        loginMessage.textContent =
          "This account is not authorized for admin access.";

        loginMessage.className =
          "login-message error";

        return;
      }

      loginPage.classList.add("hidden");
      dashboardPage.classList.remove("hidden");

      resetInactivityTimer();

    } else {

      clearTimeout(inactivityTimer);

      dashboardPage.classList.add("hidden");
      loginPage.classList.remove("hidden");

      adminPassword.value = "";
    }
  }
);
    
/* =========================================================
   ADD PRODUCT FORM
   ========================================================= */

const dashboardActions =
  document.querySelector(".dashboard-actions");

const welcomeArea =
  document.querySelector(".welcome-area");

const addProductButton =
  document.getElementById("addProductButton");

const productFormSection =
  document.getElementById("productFormSection");

const backToDashboardButton =
  document.getElementById("backToDashboardButton");

const productForm =
  document.getElementById("productForm");

const productFormMessage =
  document.getElementById("productFormMessage");

const saveProductButton =
  document.getElementById("saveProductButton");


addProductButton.addEventListener(
  "click",
  () => {

    dashboardActions.classList.add("hidden");
    welcomeArea.classList.add("hidden");

    productFormSection.classList.remove("hidden");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
);


backToDashboardButton.addEventListener(
  "click",
  () => {

    productFormSection.classList.add("hidden");

    dashboardActions.classList.remove("hidden");
    welcomeArea.classList.remove("hidden");
  }
);


productForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    productFormMessage.textContent = "";
    productFormMessage.className =
      "product-form-message";

    saveProductButton.disabled = true;
    saveProductButton.textContent =
      "Saving...";

    try {

      const user = auth.currentUser;

      if (!user) {
        throw new Error(
          "You are not logged in."
        );
      }


      const tags =
        document
          .getElementById("productTags")
          .value
          .split(",")
          .map(tag => tag.trim())
          .filter(Boolean);

      if (!productMainImage.value.trim()) {
    productFormMessage.textContent =
        "Please upload the product image first.";

    productFormMessage.className =
        "form-message error";

    return;
}

      const productData = {

        productId:
          document
            .getElementById("productId")
            .value
            .trim(),

        sku:
          document
            .getElementById("productSku")
            .value
            .trim(),

        nameEn:
          document
            .getElementById("productNameEn")
            .value
            .trim(),

        nameAr:
          document
            .getElementById("productNameAr")
            .value
            .trim(),

        category:
          document
            .getElementById("productCategory")
            .value,

        subcategory:
          document
            .getElementById("productSubcategory")
            .value
            .trim()
            .toLowerCase(),

        brand:
          document
            .getElementById("productBrand")
            .value
            .trim(),

        price:
          Number(
            document
              .getElementById("productPrice")
              .value || 0
          ),

        stockQuantity:
          Number.parseInt(
            document
              .getElementById("stockQuantity")
              .value,
              10
          ) || 0,

        showPrice:
          document
            .getElementById("showPrice")
            .checked,

        mainImage:
          document
            .getElementById("productMainImage")
            .value
            .trim(),

        mainImageFileId:
          productMainImageFileId,

        additionalImages:
          additionalImageUrls,

        additionalImageFileIds:
            additionalImageFileIds,

        additionalImageFiles:
            additionalImageFiles,

        descriptionEn:
          document
            .getElementById("productDescriptionEn")
            .value
            .trim(),

        descriptionAr:
          document
            .getElementById("productDescriptionAr")
            .value
            .trim(),

        tags,

        featured:
          document
            .getElementById("featured")
            .checked,

        newArrival:
          document
            .getElementById("newArrival")
            .checked,

        whatsappEnquiry:
          document
            .getElementById("whatsappEnquiry")
            .checked,

        status:
          document
            .getElementById("productStatus")
            .value,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),

        createdBy:
          user.uid
      };
      
if (productData.stockQuantity < 0) {

    alert(
        "Stock quantity cannot be negative."
    );

    return;
}
      await addDoc(
        collection(db, "products"),
        productData
      );


      productForm.reset();

      document
        .getElementById("whatsappEnquiry")
        .checked = true;

      document
        .getElementById("productStatus")
        .value = "active";


      productFormMessage.textContent =
        "Product saved successfully.";

      productFormMessage.classList.add(
        "success"
      );


    } catch (error) {

      console.error(error);

      productFormMessage.textContent =
        "Could not save product.";

      productFormMessage.classList.add(
        "error"
      );

    } finally {

      saveProductButton.disabled = false;

      saveProductButton.textContent =
        "Save Product";
    }
  }
  );

/* =========================================================
   MANAGE PRODUCTS
   ========================================================= */

const manageProductsButton =
    document.getElementById("manageProductsButton");

const manageProductsSection =
    document.getElementById("manageProductsSection");

const backFromManageProductsButton =
    document.getElementById(
        "backFromManageProductsButton"
    );

const manageProductsList =
    document.getElementById("manageProductsList");

const manageProductsSearch =
    document.getElementById("manageProductsSearch");

const manageProductsStatus =
    document.getElementById("manageProductsStatus");

const refreshProductsButton =
    document.getElementById("refreshProductsButton");

const dashboardContentSection =
    document.querySelector(".dashboard-content");

const addProductFormSection =
    document.getElementById("productFormSection");


/* ---------------------------------------------------------
   LOCAL PRODUCT CACHE
   --------------------------------------------------------- */

let adminProducts = [];


/* ---------------------------------------------------------
   ESCAPE TEXT BEFORE INSERTING INTO HTML
   --------------------------------------------------------- */

function escapeAdminHtml(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ---------------------------------------------------------
   GET PRODUCT DISPLAY NAME
   Supports different possible field names safely.
   --------------------------------------------------------- */

function getAdminProductName(product) {

    return (
        product.nameEn ||
        product.productNameEn ||
        product.title ||
        product.name ||
        "Unnamed Product"
    );
}


/* ---------------------------------------------------------
   GET PRODUCT IMAGE
   --------------------------------------------------------- */

function getAdminProductImage(product) {

    return (
        product.mainImage ||
        product.image ||
        ""
    );
}


/* ---------------------------------------------------------
   LOAD PRODUCTS FROM FIRESTORE
   --------------------------------------------------------- */

async function loadManageProducts() {

    if (!manageProductsList) {
        return;
    }

    manageProductsList.innerHTML = "";

    manageProductsStatus.textContent =
        "Loading products...";

    try {

        const snapshot =
            await getDocs(
                collection(db, "products")
            );

        adminProducts =
            snapshot.docs.map(productDoc => ({
                firestoreId: productDoc.id,
                ...productDoc.data()
            }));


        /* NEWEST FIRST WHEN createdAt EXISTS */

        adminProducts.sort((a, b) => {

            const aTime =
                a.createdAt?.toMillis?.() || 0;

            const bTime =
                b.createdAt?.toMillis?.() || 0;

            return bTime - aTime;
        });


        renderManageProducts(adminProducts);

    } catch (error) {

        console.error(
            "Unable to load products:",
            error
        );

        manageProductsStatus.textContent =
            "Unable to load products.";

        manageProductsList.innerHTML = `
            <div class="manage-empty-state">
                Products could not be loaded.
            </div>
        `;
    }
}


/* ---------------------------------------------------------
   RENDER PRODUCTS
   --------------------------------------------------------- */

function renderManageProducts(products) {

    manageProductsList.innerHTML = "";


    if (!products.length) {

        manageProductsStatus.textContent =
            "0 products";

        manageProductsList.innerHTML = `
            <div class="manage-empty-state">
                No products found.
            </div>
        `;

        return;
    }


    manageProductsStatus.textContent =
        `${products.length} product${
            products.length === 1 ? "" : "s"
        }`;


    products.forEach(product => {

        const card =
            document.createElement("article");

        card.className =
            "manage-product-card";


        const productName =
            product.nameEn ||
            "Unnamed Product";

        const productImage =
            product.mainImage || "";

        const additionalImages =
            Array.isArray(product.additionalImages)
                ? product.additionalImages
                : [];

        const tags =
            Array.isArray(product.tags)
                ? product.tags.join(", ")
                : product.tags || "";

        const status =
            product.status || "active";

        const isActive =
            status === "active";


        card.innerHTML = `

            <!-- IMAGE -->

            <div class="manage-product-image">

                ${
                    productImage

                    ? `
                        <img
                            src="${escapeAdminHtml(productImage)}"
                            alt="${escapeAdminHtml(productName)}"
                            loading="lazy"
                        >
                    `

                    : `
                        <div class="manage-no-image">
                            No Image
                        </div>
                    `
                }

            </div>


            <!-- BASIC INFORMATION -->

            <div class="manage-product-info">

                <h3>
                    ${escapeAdminHtml(productName)}
                </h3>

                <div class="manage-product-meta">

                    <span>
                        ${escapeAdminHtml(
                            product.category || "—"
                        )}

                        ${
                            product.subcategory
                                ? ` / ${escapeAdminHtml(
                                    product.subcategory
                                )}`
                                : ""
                        }
                    </span>

                    <span>
                        SKU:
                        ${escapeAdminHtml(
                            product.sku || "—"
                        )}
                    </span>

                    <span>
                        Stock:
                        ${Number(
                            product.stockQuantity || 0
                        )}
                    </span>

                    <span>
                        OMR
                        ${Number(
                            product.price || 0
                        ).toFixed(3)}
                    </span>

                </div>

            </div>


            <!-- ACTIONS -->

            <div class="manage-product-actions">

                <span
                    class="
                        manage-status-badge
                        ${isActive
                            ? "active"
                            : "disabled"}
                    "
                >
                    ${isActive
                        ? "Active"
                        : "Inactive"}
                </span>


                <button
                    type="button"
                    class="manage-edit-details"
                    data-product-id="${
                        escapeAdminHtml(
                            product.firestoreId
                        )
                    }"
                >
                    Edit Product
                </button>


                <button
                    type="button"
                    class="
                        manage-toggle-status
                        ${isActive
                            ? "disable"
                            : "enable"}
                    "
                    data-product-id="${
                        escapeAdminHtml(
                            product.firestoreId
                        )
                    }"
                    data-current-status="${
                        isActive
                            ? "active"
                            : "inactive"
                    }"
                >
                    ${isActive
                        ? "Set Inactive"
                        : "Set Active"}
                </button>
                <button
    type="button"
    class="manage-delete-product"
    data-product-id="${
        escapeAdminHtml(
            product.firestoreId
        )
    }"
>
    Delete Product
</button>

            </div>


            <!-- FULL PRODUCT EDITOR -->

            <div
                class="manage-product-editor hidden"
                data-editor-id="${
                    escapeAdminHtml(
                        product.firestoreId
                    )
                }"
            >

                <div class="manage-editor-grid">


                    <!-- PRODUCT ID -->

                    <div class="manage-editor-field">

                        <label>
                            Product ID
                        </label>

                        <input
                            type="text"
                            class="edit-product-id"
                            value="${
                                escapeAdminHtml(
                                    product.productId || ""
                                )
                            }"
                        >

                    </div>


                    <!-- SKU -->

                    <div class="manage-editor-field">

                        <label>
                            SKU
                        </label>

                        <input
                            type="text"
                            class="edit-product-sku"
                            value="${
                                escapeAdminHtml(
                                    product.sku || ""
                                )
                            }"
                        >

                    </div>


                    <!-- NAME EN -->

                    <div class="manage-editor-field">

                        <label>
                            Product Name EN
                        </label>

                        <input
                            type="text"
                            class="edit-name-en"
                            value="${
                                escapeAdminHtml(
                                    product.nameEn || ""
                                )
                            }"
                        >

                    </div>


                    <!-- NAME AR -->

                    <div class="manage-editor-field">

                        <label>
                            Product Name AR
                        </label>

                        <input
                            type="text"
                            class="edit-name-ar"
                            dir="rtl"
                            value="${
                                escapeAdminHtml(
                                    product.nameAr || ""
                                )
                            }"
                        >

                    </div>


                    <!-- CATEGORY -->

                    <div class="manage-editor-field">

                        <label>
                            Category
                        </label>

                        <select class="edit-category">

                            <option
                                value="jewellery"
                                ${
                                    product.category ===
                                    "jewellery"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Jewellery
                            </option>

                            <option
                                value="watches"
                                ${
                                    product.category ===
                                    "watches"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Watches
                            </option>

                            <option
                                value="perfumes"
                                ${
                                    product.category ===
                                    "perfumes"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Perfumes
                            </option>

                            <option
                                value="souvenirs"
                                ${
                                    product.category ===
                                    "souvenirs"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Souvenirs
                            </option>

                        </select>

                    </div>


                    <!-- SUBCATEGORY -->

                    <div class="manage-editor-field">

                        <label>
                            Subcategory
                        </label>

                        <input
                            type="text"
                            class="edit-subcategory"
                            value="${
                                escapeAdminHtml(
                                    product.subcategory || ""
                                )
                            }"
                        >

                    </div>


                    <!-- BRAND -->

                    <div class="manage-editor-field">

                        <label>
                            Brand
                        </label>

                        <input
                            type="text"
                            class="edit-brand"
                            value="${
                                escapeAdminHtml(
                                    product.brand || ""
                                )
                            }"
                        >

                    </div>


                    <!-- PRICE -->

                    <div class="manage-editor-field">

                        <label>
                            Price OMR
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.001"
                            class="edit-price"
                            value="${
                                Number(
                                    product.price || 0
                                )
                            }"
                        >

                    </div>


                    <!-- STOCK -->

                    <div class="manage-editor-field">

                        <label>
                            Stock Quantity
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="1"
                            class="edit-stock"
                            value="${
                                Number(
                                    product.stockQuantity || 0
                                )
                            }"
                        >

                    </div>


                    <!-- STATUS -->

                    <div class="manage-editor-field">

                        <label>
                            Status
                        </label>

                        <select class="edit-status">

                            <option
                                value="active"
                                ${
                                    isActive
                                        ? "selected"
                                        : ""
                                }
                            >
                                Active
                            </option>

                            <option
                                value="inactive"
                                ${
                                    !isActive
                                        ? "selected"
                                        : ""
                                }
                            >
                                Inactive
                            </option>

                        </select>

                    </div>

                </div>


                <!-- DESCRIPTION EN -->

                <div class="manage-editor-field">

                    <label>
                        Description EN
                    </label>

                    <textarea
                        class="edit-description-en"
                        rows="4"
                    >${
                        escapeAdminHtml(
                            product.descriptionEn || ""
                        )
                    }</textarea>

                </div>


                <!-- DESCRIPTION AR -->

                <div class="manage-editor-field">

                    <label>
                        Description AR
                    </label>

                    <textarea
                        class="edit-description-ar"
                        rows="4"
                        dir="rtl"
                    >${
                        escapeAdminHtml(
                            product.descriptionAr || ""
                        )
                    }</textarea>

                </div>


                <!-- TAGS -->

                <div class="manage-editor-field">

                    <label>
                        Tags
                    </label>

                    <input
                        type="text"
                        class="edit-tags"
                        value="${
                            escapeAdminHtml(tags)
                        }"
                        placeholder="bracelet, gold plated, ladies"
                    >

                </div>


                <!-- OPTIONS -->

                <div class="manage-editor-options">


                    <label>

                        <input
                            type="checkbox"
                            class="edit-show-price"
                            ${
                                product.showPrice
                                    ? "checked"
                                    : ""
                            }
                        >

                        Show Price

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            class="edit-featured"
                            ${
                                product.featured
                                    ? "checked"
                                    : ""
                            }
                        >

                        Featured

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            class="edit-new-arrival"
                            ${
                                product.newArrival
                                    ? "checked"
                                    : ""
                            }
                        >

                        New Arrival

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            class="edit-whatsapp"
                            ${
                                product.whatsappEnquiry
                                    ? "checked"
                                    : ""
                            }
                        >

                        WhatsApp Enquiry

                    </label>

                </div>

                <!-- CURRENT IMAGES -->

                <div class="manage-current-images">

                    <h4>
                        Current Product Images
                    </h4>


                    <!-- MAIN IMAGE -->

                    <div class="manage-main-image-editor">

                        <div class="manage-main-image-preview">

                            <span>
                                Main Image
                            </span>

                            ${
                                productImage
                                    ? `
                                        <img
                                            class="manage-edit-main-image-preview"
                                            src="${escapeAdminHtml(productImage)}"
                                            alt="${escapeAdminHtml(productName)}"
                                            loading="lazy"
                                        >
                                    `
                                    : `
                                        <div class="manage-no-image">
                                            No Main Image
                                        </div>
                                    `
                            }

                        </div>


                        <div class="manage-main-image-controls">

                            <label>
                                Replace Main Image
                            </label>

                            <input
                                type="file"
                                class="manage-replace-main-image-input"
                                accept="image/*"
                            >

                            <button
                                type="button"
                                class="manage-replace-main-image-button"
                                data-product-id="${
                                    escapeAdminHtml(
                                        product.firestoreId
                                    )
                                }"
                            >
                                Upload New Main Image
                            </button>

                            <div
                                class="manage-main-image-message"
                                aria-live="polite"
                            ></div>

                        </div>

                    </div>


                            <div class="manage-additional-images-editor">

                        <h4>
                            Additional Images
                        </h4>


                        <!-- CURRENT ADDITIONAL IMAGES -->

                        ${
                            additionalImages.length
                                ? `
                                    <div class="manage-current-image-grid">

                                        ${
  additionalImages
    .map(
        (image, imageIndex) => `
            <div class="manage-additional-image-item">

                <span>
                    Additional ${
                        imageIndex + 1
                    }
                </span>

                <img
                    src="${
                        escapeAdminHtml(
                            image
                        )
                    }"
                    alt=""
                    loading="lazy"
                >

                <button
                    type="button"
                    class="manage-remove-additional-image-button"
                    data-product-id="${
                        escapeAdminHtml(
                            product.firestoreId
                        )
                    }"
                    data-image-index="${
                        imageIndex
                    }"
                >
                    Remove
                </button>

            </div>
        `
    )
    .join("")
                                        }

                                    </div>
                                `
                                : `
                                    <p class="manage-no-additional-images">
                                        No additional images.
                                    </p>
                                `
                        }


                        <!-- ADD MORE ADDITIONAL IMAGES -->

                        <div class="manage-additional-image-controls">

                            <label>
                                Add More Images
                            </label>

                            <input
                                type="file"
                                class="manage-add-additional-images-input"
                                accept="image/*"
                                multiple
                            >

                            <button
                                type="button"
                                class="manage-add-additional-images-button"
                                data-product-id="${
                                    escapeAdminHtml(
                                        product.firestoreId
                                    )
                                }"
                            >
                                Upload Additional Images
                            </button>

                            <div
                                class="manage-additional-images-message"
                                aria-live="polite"
                            ></div>

                        </div>

                    </div>


                <!-- SAVE -->

                <div class="manage-editor-actions">

                    <button
                        type="button"
                        class="manage-save-full-product"
                        data-product-id="${
                            escapeAdminHtml(
                                product.firestoreId
                            )
                        }"
                    >
                        Save Changes
                    </button>

                </div>

            </div>
        `;


        manageProductsList.appendChild(card);
    });
}

/* ---------------------------------------------------------
   SEARCH PRODUCTS
   --------------------------------------------------------- */

manageProductsSearch?.addEventListener(
    "input",
    () => {

        const search =
            manageProductsSearch.value
                .trim()
                .toLowerCase();


        if (!search) {

            renderManageProducts(adminProducts);
            return;
        }


        const filtered =
            adminProducts.filter(product => {

        const searchableText = [

            product.productId,
            product.sku,

            product.nameEn,
            product.nameAr,

            product.category,
            product.subcategory,
            product.brand,

            product.descriptionEn,
            product.descriptionAr,

            ...(Array.isArray(product.tags)
            ? product.tags
            : [])

        ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

                return searchableText.includes(search);
            });


        renderManageProducts(filtered);
    }
);


/* ---------------------------------------------------------
   ENABLE / DISABLE PRODUCT
   --------------------------------------------------------- */

manageProductsList?.addEventListener(
    "click",
    async event => {

/* =================================================
   DELETE PRODUCT
   STEP 7B — FIRESTORE PRODUCT ONLY
   ================================================= */

const deleteProductButton =
    event.target.closest(
        ".manage-delete-product"
    );

if (deleteProductButton) {

    const firestoreId =
        deleteProductButton.dataset.productId;

    const localProduct =
        adminProducts.find(
            item =>
                item.firestoreId ===
                firestoreId
        );

    if (!localProduct) {

        alert(
            "Unable to find this product."
        );

        return;
    }

    const productName =
        localProduct.nameEn ||
        localProduct.productNameEn ||
        localProduct.title ||
        localProduct.name ||
        "this product";

    const shouldDelete =
        window.confirm(
            `Permanently delete "${productName}"?`
        );

    if (!shouldDelete) {
        return;
    }

    /*
       STEP 7B deliberately deletes ONLY
       the Firestore product.

       ImageKit cleanup will be connected
       separately after this is tested.
    */

    deleteProductButton.disabled = true;
    deleteProductButton.textContent =
        "Deleting...";

    try {

        await deleteDoc(
            doc(
                db,
                "products",
                firestoreId
            )
        );

        /*
           Firestore succeeded.
           Now remove the product from
           the local Manage Products cache.
        */

        adminProducts =
            adminProducts.filter(
                item =>
                    item.firestoreId !==
                    firestoreId
            );

        renderManageProducts(
            adminProducts
        );

        console.log(
            "Product deleted from Firestore:",
            firestoreId
        );

    } catch (error) {

        console.error(
            "Unable to delete product:",
            error
        );

        alert(
            error.message ||
            "Unable to delete this product."
        );

        deleteProductButton.disabled =
            false;

        deleteProductButton.textContent =
            "Delete Product";
    }

    return;
}


/* =================================================
           REMOVE ADDITIONAL PRODUCT IMAGE
================================================= */

const removeAdditionalImageButton =
    event.target.closest(
        ".manage-remove-additional-image-button"
    );

if (removeAdditionalImageButton) {

    const editor =
        removeAdditionalImageButton.closest(
            ".manage-product-editor"
        );

    if (!editor) {
        return;
    }

    const firestoreId =
        removeAdditionalImageButton.dataset.productId;

    const imageIndex =
        Number(
            removeAdditionalImageButton.dataset.imageIndex
        );

    const localProduct =
        adminProducts.find(
            item =>
                item.firestoreId ===
                firestoreId
        );

    if (!localProduct) {

        alert(
            "Unable to find this product."
        );

        return;
    }

    const existingAdditionalImages =
        Array.isArray(
            localProduct.additionalImages
        )
            ? localProduct.additionalImages
            : [];

    if (
        !Number.isInteger(imageIndex) ||
        imageIndex < 0 ||
        imageIndex >= existingAdditionalImages.length
    ) {

        alert(
            "Unable to find this image."
        );

        return;
    }

    /*
       IMPORTANT:
       Capture the exact URL BEFORE removing it.

       We use the URL to find the matching
       { url, fileId } record.
    */

    const imageUrlToRemove =
        existingAdditionalImages[imageIndex];

    const existingAdditionalImageFiles =
        Array.isArray(
            localProduct.additionalImageFiles
        )
            ? localProduct.additionalImageFiles
            : [];

    const matchingImageFile =
        existingAdditionalImageFiles.find(
            imageFile =>
                imageFile &&
                imageFile.url === imageUrlToRemove
        );

    /*
       Keep the fileId available for the future
       ImageKit deletion step.

       We DO NOT delete from ImageKit in Step 4D.
    */

    const imageKitFileId =
        matchingImageFile?.fileId || "";

    const shouldRemove =
        window.confirm(
            "Remove this additional image from the product?"
        );

    if (!shouldRemove) {
        return;
    }

    removeAdditionalImageButton.disabled =
        true;

    removeAdditionalImageButton.textContent =
        "Removing...";

    try {

        /*
           Remove the selected URL from the
           public additionalImages array.
        */

        const updatedAdditionalImages =
            existingAdditionalImages.filter(
                (image, index) =>
                    index !== imageIndex
            );

        /*
           Remove the paired record ONLY when
           its URL matches the selected image.

           Legacy images without a paired record
           are safely ignored here.
        */

        const updatedAdditionalImageFiles =
            existingAdditionalImageFiles.filter(
                imageFile =>
                    !imageFile ||
                    imageFile.url !== imageUrlToRemove
            );

        /*
           IMPORTANT:
           additionalImageFileIds is an older
           transitional field and may not align
           with additionalImages.

           Only remove a fileId from it when we
           have positively identified that fileId
           through additionalImageFiles.
        */

        const existingAdditionalImageFileIds =
            Array.isArray(
                localProduct.additionalImageFileIds
            )
                ? localProduct.additionalImageFileIds
                : [];

        const updatedAdditionalImageFileIds =
            imageKitFileId
                ? existingAdditionalImageFileIds.filter(
                    fileId =>
                        fileId !== imageKitFileId
                )
                : existingAdditionalImageFileIds;

        await updateDoc(

            doc(
                db,
                "products",
                firestoreId
            ),

            {
                additionalImages:
                    updatedAdditionalImages,

                additionalImageFiles:
                    updatedAdditionalImageFiles,

                additionalImageFileIds:
                    updatedAdditionalImageFileIds,

                updatedAt:
                    serverTimestamp()
            }

        );

        /*
           Update local cache only AFTER
           Firestore succeeds.
        */

        localProduct.additionalImages =
            updatedAdditionalImages;

        localProduct.additionalImageFiles =
            updatedAdditionalImageFiles;

        localProduct.additionalImageFileIds =
            updatedAdditionalImageFileIds;


/*
   PERMANENT IMAGEKIT CLEANUP

   Firestore has already been updated
   successfully above.

   Only attempt physical deletion when
   this image has a verified fileId.
*/

if (imageKitFileId) {

    try {

        if (!auth.currentUser) {
            throw new Error(
                "You are not logged in."
            );
        }

        const firebaseToken =
            await auth.currentUser.getIdToken();

        const deleteResponse =
            await fetch(
                IMAGEKIT_AUTH_ENDPOINT,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            "Bearer " +
                            firebaseToken,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        fileId:
                            imageKitFileId
                    })
                }
            );

        const deleteResult =
            await deleteResponse.json();

        if (!deleteResponse.ok) {

            console.error(
                "ImageKit permanent deletion failed:",
                deleteResult
            );

            throw new Error(
                deleteResult.error ||
                "ImageKit file deletion failed."
            );
        }

        console.log(
            "ImageKit file permanently deleted:",
            imageKitFileId
        );

    } catch (deleteError) {

        /*
           IMPORTANT:
           Do not undo the Firestore removal.

           The product is already correct.
           A failed ImageKit deletion only
           leaves an orphan file that can
           be cleaned later.
        */

        console.error(
            "Image removed from product, but ImageKit cleanup failed:",
            deleteError
        );

        alert(
            "The image was removed from the product, but its ImageKit file could not be permanently deleted."
        );
    }

} else {

    /*
       Legacy image:
       no safely matched fileId exists,
       therefore never guess which
       ImageKit file should be deleted.
    */

    console.log(
        "Legacy image removed from product. No tracked ImageKit fileId was available for permanent deletion."
    );
}


renderManageProducts(
    adminProducts
);

    } catch (error) {

        console.error(
            "Unable to remove additional image:",
            error
        );

        alert(
            error.message ||
            "Unable to remove additional image."
        );

        removeAdditionalImageButton.disabled =
            false;

        removeAdditionalImageButton.textContent =
            "Remove";
    }

    return;
}

        /* =================================================
           REPLACE MAIN PRODUCT IMAGE
           ================================================= */

        const replaceMainImageButton =
            event.target.closest(
                ".manage-replace-main-image-button"
            );


        if (replaceMainImageButton) {

            const card =
                replaceMainImageButton.closest(
                    ".manage-product-card"
                );


            if (!card) {
                return;
            }


            const editor =
                replaceMainImageButton.closest(
                    ".manage-product-editor"
                );


            if (!editor) {
                return;
            }


            const imageInput =
                editor.querySelector(
                    ".manage-replace-main-image-input"
                );


            const message =
                editor.querySelector(
                    ".manage-main-image-message"
                );


            const preview =
                editor.querySelector(
                    ".manage-edit-main-image-preview"
                );


            const firestoreId =
                replaceMainImageButton.dataset.productId;

/*
   CAPTURE CURRENT MAIN IMAGE FILE ID

   This must happen BEFORE uploading the
   replacement because Firestore will later
   receive the new fileId.
*/

const existingProduct =
    adminProducts.find(
        item =>
            item.firestoreId ===
            firestoreId
    );

const oldMainImageFileId =
    existingProduct?.mainImageFileId || "";


            if (
                !imageInput ||
                !imageInput.files ||
                !imageInput.files.length
            ) {

                if (message) {
                    message.textContent =
                        "Please choose a new main image first.";
                }

                return;
            }


            const originalFile =
                imageInput.files[0];


            if (
                !originalFile.type.startsWith(
                    "image/"
                )
            ) {

                if (message) {
                    message.textContent =
                        "Please select a valid image file.";
                }

                return;
            }


            replaceMainImageButton.disabled =
                true;

            replaceMainImageButton.textContent =
                "Optimizing...";


            if (message) {
                message.textContent =
                    "Optimizing new main image...";
            }


            try {

                /* -----------------------------------------
                   OPTIMIZE USING EXISTING SYSTEM
                   ----------------------------------------- */

                const optimizedFile =
                    await optimizeProductImage(
                        originalFile
                    );


                if (message) {
                    message.textContent =
                        "Uploading optimized image...";
                }


                replaceMainImageButton.textContent =
                    "Uploading...";


                /* -----------------------------------------
                   CHECK FIREBASE LOGIN
                   ----------------------------------------- */

                if (!auth.currentUser) {

                    throw new Error(
                        "You are not logged in."
                    );
                }


                const firebaseToken =
                    await auth.currentUser.getIdToken();


                /* -----------------------------------------
                   GET IMAGEKIT AUTHORIZATION
                   ----------------------------------------- */

                const authResponse =
                    await fetch(
                        IMAGEKIT_AUTH_ENDPOINT,
                        {
                            method: "GET",

                            headers: {
                                Authorization:
                                    "Bearer " +
                                    firebaseToken
                            }
                        }
                    );


                if (!authResponse.ok) {

                    throw new Error(
                        "Unable to authorize image upload."
                    );
                }


                const imageKitAuth =
                    await authResponse.json();


                /* -----------------------------------------
                   UPLOAD OPTIMIZED IMAGE TO IMAGEKIT
                   ----------------------------------------- */

                const formData =
                    new FormData();


                formData.append(
                    "file",
                    optimizedFile
                );


                formData.append(
                    "fileName",
                    createSafeFileName()
                );


                formData.append(
                    "publicKey",
                    IMAGEKIT_PUBLIC_KEY
                );


                formData.append(
                    "signature",
                    imageKitAuth.signature
                );


                formData.append(
                    "expire",
                    imageKitAuth.expire
                );


                formData.append(
                    "token",
                    imageKitAuth.token
                );


                formData.append(
                    "folder",
                    "/jewel-corner/products"
                );


                const uploadResponse =
                    await fetch(
                        "https://upload.imagekit.io/api/v1/files/upload",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const uploadResult =
                    await uploadResponse.json();


                if (!uploadResponse.ok) {

                    console.error(
                        "ImageKit replacement error:",
                        uploadResult
                    );


                    throw new Error(
                        uploadResult.message ||
                        "Main image upload failed."
                    );
                }


                /* -----------------------------------------
                   UPDATE FIRESTORE
                   ----------------------------------------- */

                await updateDoc(

                    doc(
                        db,
                        "products",
                        firestoreId
                    ),

                   {
                        mainImage:
                            uploadResult.url,

                        mainImageFileId:
                            uploadResult.fileId,

                        updatedAt:
                            serverTimestamp()
                    }
                );


                /* -----------------------------------------
                   UPDATE LOCAL PRODUCT CACHE
                   ----------------------------------------- */

                const localProduct =
                    adminProducts.find(
                        item =>
                            item.firestoreId ===
                            firestoreId
                    );


                if (localProduct) {

                    localProduct.mainImage =
                        uploadResult.url;

                    localProduct.mainImageFileId =
                        uploadResult.fileId;
                }

              /*
   PERMANENTLY DELETE OLD MAIN IMAGE

   The NEW image has already been uploaded
   and Firestore has already been updated.

   Never delete anything unless the OLD
   main image has a safely tracked fileId.
*/

if (
    oldMainImageFileId &&
    oldMainImageFileId !== uploadResult.fileId
) {

    try {

        if (!auth.currentUser) {
            throw new Error(
                "You are not logged in."
            );
        }

        const deleteFirebaseToken =
            await auth.currentUser.getIdToken();

        const deleteResponse =
            await fetch(
                IMAGEKIT_AUTH_ENDPOINT,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            "Bearer " +
                            deleteFirebaseToken,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        fileId:
                            oldMainImageFileId
                    })
                }
            );

        const deleteResult =
            await deleteResponse.json();

        if (!deleteResponse.ok) {

            console.error(
                "Old main image ImageKit deletion failed:",
                deleteResult
            );

            throw new Error(
                deleteResult.error ||
                "Old main image deletion failed."
            );
        }

        console.log(
            "Old main image permanently deleted from ImageKit:",
            oldMainImageFileId
        );

    } catch (deleteError) {

        /*
           IMPORTANT:
           Do NOT undo the replacement.

           The new image is already safely
           stored in Firestore.

           Failure here only leaves the old
           ImageKit file as an orphan.
        */

        console.error(
            "Main image replaced, but old ImageKit cleanup failed:",
            deleteError
        );

        if (message) {

            message.textContent =
                "Main image replaced, but the old ImageKit file could not be deleted.";
        }
    }

} else if (!oldMainImageFileId) {

    /*
       Legacy main image.

       There is no safely tracked old fileId,
       so never guess which ImageKit file
       should be deleted.
    */

    console.log(
        "Main image replaced. Previous image had no tracked ImageKit fileId, so no permanent deletion was attempted."
    );
}

                /* -----------------------------------------
                   UPDATE CURRENT PREVIEW
                   ----------------------------------------- */

                if (preview) {

                    preview.src =
                        uploadResult.url;
                }


                if (message) {

                    message.textContent =
                        "Main image replaced successfully.";
                }


                replaceMainImageButton.textContent =
                    "Uploaded ✓";


                imageInput.value = "";


                setTimeout(
                    () => {

                        renderManageProducts(
                            adminProducts
                        );

                    },
                    1200
                );


            } catch (error) {

                console.error(
                    "Unable to replace main image:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message ||
                        "Unable to replace main image.";
                }


                replaceMainImageButton.disabled =
                    false;


                replaceMainImageButton.textContent =
                    "Upload New Main Image";
            }


            return;
        }

        /* =================================================
           ADD MORE ADDITIONAL PRODUCT IMAGES
           ================================================= */

        const addAdditionalImagesButton =
            event.target.closest(
                ".manage-add-additional-images-button"
            );


        if (addAdditionalImagesButton) {

            const editor =
                addAdditionalImagesButton.closest(
                    ".manage-product-editor"
                );


            if (!editor) {
                return;
            }


            const imageInput =
                editor.querySelector(
                    ".manage-add-additional-images-input"
                );


            const message =
                editor.querySelector(
                    ".manage-additional-images-message"
                );


            const firestoreId =
                addAdditionalImagesButton.dataset.productId;


            if (
                !imageInput ||
                !imageInput.files ||
                !imageInput.files.length
            ) {

                if (message) {
                    message.textContent =
                        "Please choose one or more images first.";
                }

                return;
            }


            const selectedFiles =
                Array.from(
                    imageInput.files
                );


            const invalidFile =
                selectedFiles.find(
                    file =>
                        !file.type.startsWith(
                            "image/"
                        )
                );


            if (invalidFile) {

                if (message) {
                    message.textContent =
                        "Please select valid image files only.";
                }

                return;
            }


            const localProduct =
                adminProducts.find(
                    item =>
                        item.firestoreId ===
                        firestoreId
                );


            if (!localProduct) {

                if (message) {
                    message.textContent =
                        "Unable to find this product.";
                }

                return;
            }


            addAdditionalImagesButton.disabled =
                true;


            addAdditionalImagesButton.textContent =
                "Uploading...";


            if (message) {
                message.textContent =
                    "Preparing additional images...";
            }


            try {

                const newImageUrls = [];
                const newImageFileIds = [];
                const newAdditionalImageFiles = [];


                for (
                    let index = 0;
                    index < selectedFiles.length;
                    index++
                ) {

                    const file =
                        selectedFiles[index];


                    if (message) {

                        message.textContent =
                            "Optimizing and uploading image " +
                            (index + 1) +
                            " of " +
                            selectedFiles.length +
                            "...";
                    }


                    const uploadedImage =
                        await uploadAdditionalImageToImageKit(
                            file
                        );

                    newImageUrls.push(
                        uploadedImage.url
                    );

                    newImageFileIds.push(
                        uploadedImage.fileId
                    );
                  newAdditionalImageFiles.push({
                        url: uploadedImage.url,
                        fileId: uploadedImage.fileId
                   });
                }


                const existingAdditionalImages =
                    Array.isArray(
                        localProduct.additionalImages
                    )
                        ? localProduct.additionalImages
                        : [];


                const updatedAdditionalImages = [
                    ...existingAdditionalImages,
                    ...newImageUrls
                ];
                const existingAdditionalImageFiles =
                    Array.isArray(
                    localProduct.additionalImageFiles
                )
                  ? localProduct.additionalImageFiles
                : [];

                const updatedAdditionalImageFiles = [
                    ...existingAdditionalImageFiles,
                    ...newAdditionalImageFiles
                ];

                const existingAdditionalImageFileIds =
                    Array.isArray(
                        localProduct.additionalImageFileIds
                    )
                        ? localProduct.additionalImageFileIds
                        : [];

                const updatedAdditionalImageFileIds = [
                    ...existingAdditionalImageFileIds,
                    ...newImageFileIds
                ];


                if (message) {
                    message.textContent =
                        "Saving additional images...";
                }


                await updateDoc(

                    doc(
                        db,
                        "products",
                        firestoreId
                    ),

                  {
                additionalImages:
                    updatedAdditionalImages,

                additionalImageFileIds:
                    updatedAdditionalImageFileIds,

                additionalImageFiles:
                    updatedAdditionalImageFiles,

                updatedAt:
                    serverTimestamp()
                  }

                );


                localProduct.additionalImages =
                    updatedAdditionalImages;
                localProduct.additionalImageFileIds =
                    updatedAdditionalImageFileIds;
                localProduct.additionalImageFiles =
                    updatedAdditionalImageFiles;


                imageInput.value = "";


                if (message) {

                    message.textContent =
                        newImageUrls.length +
                        (
                            newImageUrls.length === 1
                                ? " image added successfully."
                                : " images added successfully."
                        );
                }


                addAdditionalImagesButton.textContent =
                    "Uploaded ✓";


                setTimeout(
                    () => {

                        renderManageProducts(
                            adminProducts
                        );

                    },
                    1200
                );


            } catch (error) {

                console.error(
                    "Unable to add additional images:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message ||
                        "Unable to upload additional images.";
                }


                addAdditionalImagesButton.disabled =
                    false;


                addAdditionalImagesButton.textContent =
                    "Upload Additional Images";
            }


            return;
        }
      

        /* =================================================
           OPEN / CLOSE EDITOR
           ================================================= */

        const editButton =
            event.target.closest(
                ".manage-edit-details"
            );


        if (editButton) {

            const firestoreId =
                editButton.dataset.productId;


            const editor =
                manageProductsList.querySelector(
                    `[data-editor-id="${firestoreId}"]`
                );


            if (!editor) {
                return;
            }


            const opening =
                editor.classList.contains(
                    "hidden"
                );


            editor.classList.toggle(
                "hidden"
            );


            editButton.textContent =
                opening
                    ? "Close Editor"
                    : "Edit Product";


            return;
        }



        /* =================================================
           SAVE COMPLETE PRODUCT
           ================================================= */

        const saveButton =
            event.target.closest(
                ".manage-save-full-product"
            );


        if (saveButton) {

            const firestoreId =
                saveButton.dataset.productId;


            const editor =
                manageProductsList.querySelector(
                    `[data-editor-id="${firestoreId}"]`
                );


            if (!editor) {
                return;
            }


            const productId =
                editor
                    .querySelector(
                        ".edit-product-id"
                    )
                    .value
                    .trim();


            const sku =
                editor
                    .querySelector(
                        ".edit-product-sku"
                    )
                    .value
                    .trim();


            const nameEn =
                editor
                    .querySelector(
                        ".edit-name-en"
                    )
                    .value
                    .trim();


            const nameAr =
                editor
                    .querySelector(
                        ".edit-name-ar"
                    )
                    .value
                    .trim();


            const category =
                editor
                    .querySelector(
                        ".edit-category"
                    )
                    .value;


            const subcategory =
                editor
                    .querySelector(
                        ".edit-subcategory"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const brand =
                editor
                    .querySelector(
                        ".edit-brand"
                    )
                    .value
                    .trim();


            const price =
                Number(
                    editor
                        .querySelector(
                            ".edit-price"
                        )
                        .value || 0
                );


            const stockQuantity =
                Number.parseInt(
                    editor
                        .querySelector(
                            ".edit-stock"
                        )
                        .value,
                    10
                );


            const status =
                editor
                    .querySelector(
                        ".edit-status"
                    )
                    .value;


            const descriptionEn =
                editor
                    .querySelector(
                        ".edit-description-en"
                    )
                    .value
                    .trim();


            const descriptionAr =
                editor
                    .querySelector(
                        ".edit-description-ar"
                    )
                    .value
                    .trim();


            const tags =
                editor
                    .querySelector(
                        ".edit-tags"
                    )
                    .value
                    .split(",")
                    .map(tag =>
                        tag.trim()
                    )
                    .filter(Boolean);


            const showPrice =
                editor
                    .querySelector(
                        ".edit-show-price"
                    )
                    .checked;


            const featured =
                editor
                    .querySelector(
                        ".edit-featured"
                    )
                    .checked;


            const newArrival =
                editor
                    .querySelector(
                        ".edit-new-arrival"
                    )
                    .checked;


            const whatsappEnquiry =
                editor
                    .querySelector(
                        ".edit-whatsapp"
                    )
                    .checked;



            /* VALIDATION */

            if (!productId) {

                alert(
                    "Product ID is required."
                );

                return;
            }


            if (!nameEn) {

                alert(
                    "Product Name EN is required."
                );

                return;
            }


            if (!category) {

                alert(
                    "Category is required."
                );

                return;
            }


            if (!subcategory) {

                alert(
                    "Subcategory is required."
                );

                return;
            }


            if (
                Number.isNaN(price) ||
                price < 0
            ) {

                alert(
                    "Please enter a valid price."
                );

                return;
            }


            if (
                Number.isNaN(stockQuantity) ||
                stockQuantity < 0
            ) {

                alert(
                    "Please enter a valid stock quantity."
                );

                return;
            }



            saveButton.disabled =
                true;

            saveButton.textContent =
                "Saving...";


            try {

                const updateData = {

                    productId,

                    sku,

                    nameEn,

                    nameAr,

                    category,

                    subcategory,

                    brand,

                    price,

                    stockQuantity,

                    showPrice,

                    descriptionEn,

                    descriptionAr,

                    tags,

                    featured,

                    newArrival,

                    whatsappEnquiry,

                    status,

                    updatedAt:
                        serverTimestamp()

                };


                await updateDoc(

                    doc(
                        db,
                        "products",
                        firestoreId
                    ),

                    updateData
                );



                /* UPDATE LOCAL CACHE */

                const localProduct =
                    adminProducts.find(
                        item =>
                            item.firestoreId ===
                            firestoreId
                    );


                if (localProduct) {

                    Object.assign(
                        localProduct,
                        updateData
                    );

                }


                saveButton.textContent =
                    "Saved ✓";


                setTimeout(
                    () => {

                        renderManageProducts(
                            adminProducts
                        );

                    },
                    900
                );


            } catch (error) {

                console.error(
                    "Unable to update product:",
                    error
                );


                alert(
                    "Unable to save product changes."
                );


                saveButton.disabled =
                    false;


                saveButton.textContent =
                    "Save Changes";
            }


            return;
        }



        /* =================================================
           ACTIVE / INACTIVE QUICK BUTTON
           ================================================= */

        const statusButton =
            event.target.closest(
                ".manage-toggle-status"
            );


        if (!statusButton) {
            return;
        }


        const firestoreId =
            statusButton.dataset.productId;


        const currentStatus =
            statusButton.dataset.currentStatus;


        const newStatus =
            currentStatus === "active"
                ? "inactive"
                : "active";


        statusButton.disabled =
            true;


        statusButton.textContent =
            newStatus === "inactive"
                ? "Updating..."
                : "Updating...";


        try {

            await updateDoc(

                doc(
                    db,
                    "products",
                    firestoreId
                ),

                {
                    status: newStatus,

                    updatedAt:
                        serverTimestamp()
                }

            );


            const localProduct =
                adminProducts.find(
                    item =>
                        item.firestoreId ===
                        firestoreId
                );


            if (localProduct) {

                localProduct.status =
                    newStatus;

            }


            renderManageProducts(
                adminProducts
            );


        } catch (error) {

            console.error(
                "Unable to update status:",
                error
            );


            alert(
                "Unable to update product status."
            );


            statusButton.disabled =
                false;
        }

    }
);

/* ---------------------------------------------------------
   REFRESH PRODUCTS
   --------------------------------------------------------- */

refreshProductsButton?.addEventListener(
    "click",
    () => {

        manageProductsSearch.value = "";

        loadManageProducts();
    }
);


/* ---------------------------------------------------------
   OPEN MANAGE PRODUCTS
   --------------------------------------------------------- */

manageProductsButton?.addEventListener(
    "click",
    async () => {

        dashboardContentSection
            ?.classList.add("hidden");

        addProductFormSection
            ?.classList.add("hidden");

        manageProductsSection
            ?.classList.remove("hidden");


        await loadManageProducts();
    }
);


/* ---------------------------------------------------------
   BACK TO DASHBOARD
   --------------------------------------------------------- */

backFromManageProductsButton
    ?.addEventListener(
        "click",
        () => {

            manageProductsSection
                ?.classList.add("hidden");

            addProductFormSection
                ?.classList.add("hidden");

            dashboardContentSection
                ?.classList.remove("hidden");
        }
    );

/* =========================================================
   IMAGEKIT PRODUCT IMAGE UPLOAD
========================================================= */

const productImageFile =
    document.getElementById("productImageFile");

const productImagePreviewBox =
    document.getElementById("productImagePreviewBox");

const productImagePreview =
    document.getElementById("productImagePreview");

const productMainImage =
    document.getElementById("productMainImage");

/*
   Stores the ImageKit fileId of the
   main image while creating a product.
*/
let productMainImageFileId = "";

const imageUploadMessage =
    document.getElementById("imageUploadMessage");


/* =========================================================
   IMAGE OPTIMIZATION + IMAGEKIT UPLOAD
========================================================= */

productImageFile?.addEventListener("change", async () => {

    const originalFile = productImageFile.files[0];

    if (!originalFile) return;


    /* -----------------------------------------
       Make sure selected file is an image
    ----------------------------------------- */

    if (!originalFile.type.startsWith("image/")) {

        imageUploadMessage.textContent =
            "Please select a valid image file.";

        imageUploadMessage.className =
            "image-upload-message error";

        return;
    }


    /* -----------------------------------------
       Show temporary original preview
    ----------------------------------------- */

    const temporaryPreview =
        URL.createObjectURL(originalFile);

    productImagePreview.src =
        temporaryPreview;

    productImagePreviewBox.classList.remove("hidden");

    imageUploadMessage.textContent =
        "Optimizing image...";

    imageUploadMessage.className =
        "image-upload-message";


    try {

        /* =====================================
           OPTIMIZE IMAGE BEFORE UPLOAD
        ===================================== */

        const optimizedFile =
            await optimizeProductImage(originalFile);


        const originalSize =
            formatFileSize(originalFile.size);

        const optimizedSize =
            formatFileSize(optimizedFile.size);

        const savedPercent =
            Math.max(
                0,
                Math.round(
                    (1 -
                        optimizedFile.size /
                        originalFile.size) *
                        100
                )
            );


        /* -----------------------------------------
           Show optimized preview
        ----------------------------------------- */

        URL.revokeObjectURL(temporaryPreview);

        const optimizedPreview =
            URL.createObjectURL(optimizedFile);

        productImagePreview.src =
            optimizedPreview;


        imageUploadMessage.textContent =
            `Original: ${originalSize} | ` +
            `Optimized: ${optimizedSize} | ` +
            `Saved: ${savedPercent}% | Uploading...`;


        /* =====================================
           FIREBASE LOGIN CHECK
        ===================================== */

        if (!auth.currentUser) {

            throw new Error(
                "You are not logged in."
            );
        }


        const firebaseToken =
            await auth.currentUser.getIdToken();


        /* =====================================
           GET IMAGEKIT AUTHORIZATION
        ===================================== */

        const authResponse =
            await fetch(
                IMAGEKIT_AUTH_ENDPOINT,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${firebaseToken}`
                    }
                }
            );


        if (!authResponse.ok) {

            throw new Error(
                "Unable to authorize image upload."
            );
        }


        const imageKitAuth =
            await authResponse.json();


        /* =====================================
           UPLOAD OPTIMIZED IMAGE
        ===================================== */

        const formData =
            new FormData();


        formData.append(
            "file",
            optimizedFile
        );


        formData.append(
            "fileName",
            createSafeFileName()
        );


        formData.append(
            "publicKey",
            IMAGEKIT_PUBLIC_KEY
        );


        formData.append(
            "signature",
            imageKitAuth.signature
        );


        formData.append(
            "expire",
            imageKitAuth.expire
        );


        formData.append(
            "token",
            imageKitAuth.token
        );


        formData.append(
            "folder",
            "/jewel-corner/products"
        );


        const uploadResponse =
            await fetch(
                "https://upload.imagekit.io/api/v1/files/upload",
                {
                    method: "POST",
                    body: formData
                }
            );


        const uploadResult =
            await uploadResponse.json();


        if (!uploadResponse.ok) {

            console.error(
                "ImageKit error:",
                uploadResult
            );

            throw new Error(
                uploadResult.message ||
                "Image upload failed."
            );
        }


        /* =====================================
           SAVE IMAGEKIT URL
        ===================================== */

        productMainImage.value =
        uploadResult.url;

        productMainImageFileId =
        uploadResult.fileId;


        productImagePreview.src =
        uploadResult.url;


        imageUploadMessage.textContent =
            `Image uploaded successfully. ` +
            `Original: ${originalSize} | ` +
            `Optimized: ${optimizedSize} | ` +
            `Saved: ${savedPercent}%`;


        imageUploadMessage.className =
            "image-upload-message success";


        console.log(
            "Optimized image uploaded:",
            uploadResult.url
        );


    } catch (error) {

        console.error(error);

        productMainImage.value = "";
        productMainImageFileId = "";


        imageUploadMessage.textContent =
            error.message ||
            "Image optimization or upload failed.";


        imageUploadMessage.className =
            "image-upload-message error";
    }

});


/* =========================================================
   OPTIMIZE PRODUCT IMAGE
   1200 × 1200
   1:1 ASPECT RATIO
   WEBP
========================================================= */

async function optimizeProductImage(file) {

    const TARGET_SIZE = 1200;

    const WEBP_QUALITY = 0.82;


    const image =
        await loadImageForOptimization(file);


    const canvas =
        document.createElement("canvas");


    canvas.width =
        TARGET_SIZE;

    canvas.height =
        TARGET_SIZE;


    const ctx =
        canvas.getContext("2d");


    /* -----------------------------------------
       Ivory background matching Jewel Corner
    ----------------------------------------- */

    ctx.fillStyle =
        "#F4F0E4";

    ctx.fillRect(
        0,
        0,
        TARGET_SIZE,
        TARGET_SIZE
    );


    /* -----------------------------------------
       Calculate "contain" dimensions

       Entire product remains visible.
       No automatic cropping.
    ----------------------------------------- */

    const scale =
        Math.min(
            TARGET_SIZE / image.width,
            TARGET_SIZE / image.height
        );


    const drawWidth =
        image.width * scale;

    const drawHeight =
        image.height * scale;


    const x =
        (TARGET_SIZE - drawWidth) / 2;

    const y =
        (TARGET_SIZE - drawHeight) / 2;


    ctx.drawImage(
        image,
        x,
        y,
        drawWidth,
        drawHeight
    );


    /* -----------------------------------------
       Convert canvas to compressed WebP
    ----------------------------------------- */

    const blob =
        await new Promise(
            (resolve, reject) => {

                canvas.toBlob(
                    result => {

                        if (result) {

                            resolve(result);

                        } else {

                            reject(
                                new Error(
                                    "Unable to optimize image."
                                )
                            );
                        }

                    },

                    "image/webp",

                    WEBP_QUALITY
                );
            }
        );


    return new File(
        [blob],
        `product-${Date.now()}.webp`,
        {
            type: "image/webp"
        }
    );
}

async function uploadAdditionalImageToImageKit(originalFile) {

    if (!originalFile.type.startsWith("image/")) {
        throw new Error("Please select a valid image file.");
    }

    // Reuse your EXISTING optimization system
    const optimizedFile =
        await optimizeProductImage(originalFile);

    if (!auth.currentUser) {
        throw new Error("You are not logged in.");
    }

    const firebaseToken =
        await auth.currentUser.getIdToken();

    const authResponse =
        await fetch(
            IMAGEKIT_AUTH_ENDPOINT,
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${firebaseToken}`
                }
            }
        );

    if (!authResponse.ok) {
        throw new Error(
            "Unable to authorize image upload."
        );
    }

    const imageKitAuth =
        await authResponse.json();

    const formData =
        new FormData();

    formData.append(
        "file",
        optimizedFile
    );

    formData.append(
        "fileName",
        createSafeFileName()
    );

    formData.append(
        "publicKey",
        IMAGEKIT_PUBLIC_KEY
    );

    formData.append(
        "signature",
        imageKitAuth.signature
    );

    formData.append(
        "expire",
        imageKitAuth.expire
    );

    formData.append(
        "token",
        imageKitAuth.token
    );

    formData.append(
        "folder",
        "/jewel-corner/products"
    );

    const uploadResponse =
        await fetch(
            "https://upload.imagekit.io/api/v1/files/upload",
            {
                method: "POST",
                body: formData
            }
        );

    const uploadResult =
        await uploadResponse.json();

    if (!uploadResponse.ok) {

        console.error(
            "Additional ImageKit error:",
            uploadResult
        );

        throw new Error(
            uploadResult.message ||
            "Additional image upload failed."
        );
    }

        return {
        url: uploadResult.url,
        fileId: uploadResult.fileId
    };
}


/* =========================================================
   LOAD IMAGE
========================================================= */

function loadImageForOptimization(file) {

    return new Promise(
        (resolve, reject) => {

            const img =
                new Image();


            const objectUrl =
                URL.createObjectURL(file);


            img.onload = () => {

                URL.revokeObjectURL(
                    objectUrl
                );

                resolve(img);
            };


            img.onerror = () => {

                URL.revokeObjectURL(
                    objectUrl
                );

                reject(
                    new Error(
                        "Unable to read this image."
                    )
                );
            };


            img.src =
                objectUrl;
        }
    );
}


/* =========================================================
   IMAGEKIT FILE NAME
========================================================= */

function createSafeFileName() {

    return (
        "product-" +
        Date.now() +
        ".webp"
    );
}


/* =========================================================
   FORMAT FILE SIZE
========================================================= */

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return `${bytes} B`;
    }


    if (bytes < 1024 * 1024) {

        return (
            bytes / 1024
        ).toFixed(1) + " KB";
    }


    return (
        bytes /
        (1024 * 1024)
    ).toFixed(2) + " MB";
}
const additionalImagesInput =
    document.getElementById("additionalImages");

const additionalImagesPreview =
    document.getElementById("additionalImagesPreview");

let additionalImageUrls = [];
let additionalImageFileIds = [];
let additionalImageFiles = [];


additionalImagesInput.addEventListener(
    "change",
    async () => {

        additionalImagesPreview.innerHTML = "";

        additionalImageUrls = [];
        additionalImageFileIds = [];
        

        const files =
            Array.from(additionalImagesInput.files);


        for (const file of files) {

            if (!file.type.startsWith("image/")) {
                continue;
            }


            /* -----------------------------------------
               Show temporary preview
            ----------------------------------------- */

            const previewUrl =
                URL.createObjectURL(file);

            const img =
                document.createElement("img");

            img.src =
                previewUrl;

            img.alt =
                "Additional product image";

            img.style.width =
                "100px";

            img.style.height =
                "100px";

            img.style.objectFit =
                "contain";

            img.style.borderRadius =
                "8px";

            img.style.border =
                "1px solid #ddd";

            img.style.background =
                "#F4F0E4";

            img.style.padding =
                "4px";

            additionalImagesPreview.appendChild(img);


            try {

                /* =====================================
                   OPTIMIZE + UPLOAD
                ===================================== */

                const uploadedImage =
                    await uploadAdditionalImageToImageKit(
                        file
                    );

                additionalImageUrls.push(
                    uploadedImage.url
                );

                additionalImageFileIds.push(
                    uploadedImage.fileId
                );

                additionalImageFiles.push({
                  url: uploadedImage.url,
                  fileId: uploadedImage.fileId
                });


                /* -----------------------------------------
                   Replace preview with ImageKit URL
                ----------------------------------------- */

                URL.revokeObjectURL(
                    previewUrl
                );

                img.src =
                    uploadedImage.url;

                console.log(
                    "Additional image uploaded:",
                    uploadedImage.url
                );

            } catch (error) {

                console.error(
                    "Additional image upload failed:",
                    error
                );

                img.style.opacity =
                    "0.4";

                img.title =
                    error.message ||
                    "Upload failed";
            }
        }


        console.log(
            "Additional image URLs:",
            additionalImageUrls
        );
    }
);

/* =========================================================
   PASSWORD VISIBILITY TOGGLE
   ========================================================= */

const passwordToggle =
    document.getElementById("passwordToggle");

const adminPasswordInput =
    document.getElementById("adminPassword");

passwordToggle?.addEventListener(
    "click",
    () => {

        const isHidden =
            adminPasswordInput.type === "password";

        adminPasswordInput.type =
            isHidden ? "text" : "password";

        passwordToggle.setAttribute(
            "aria-label",
            isHidden
                ? "Hide password"
                : "Show password"
        );
    }
);
