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

        additionalImages: additionalImageUrls,

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
            getAdminProductName(product);

        const productImage =
            getAdminProductImage(product);

        const category =
            product.category || "—";

        const subcategory =
            product.subcategory || "";

        const sku =
            product.sku ||
            product.productSku ||
            "—";

        const status =
            product.status || "active";

        const isActive =
            status !== "disabled";

        const price =
    product.price ??
    product.priceOMR ??
    product.unitPrice ??
    "";

const stockQuantity =
    product.stockQuantity ??
    product.stock ??
    product.quantity ??
    0;

const descriptionEn =
    product.descriptionEn ||
    product.description ||
    "";

const descriptionAr =
    product.descriptionAr || "";


        card.innerHTML = `

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


            <div class="manage-product-info">

                <h3>
                    ${escapeAdminHtml(productName)}
                </h3>

                <div class="manage-product-meta">

                    <span>
                        ${escapeAdminHtml(category)}
                        ${
                            subcategory
                            ? ` / ${escapeAdminHtml(subcategory)}`
                            : ""
                        }
                    </span>

                    <span>
                        SKU: ${escapeAdminHtml(sku)}
                    </span>

                </div>

            </div>


<div class="manage-product-actions">

    <span
        class="
            manage-status-badge
            ${isActive ? "active" : "disabled"}
        "
    >
        ${isActive ? "Active" : "Disabled"}
    </span>

    <button
        type="button"
        class="manage-edit-details"
        data-product-id="${escapeAdminHtml(product.firestoreId)}"
    >
        Edit Details
    </button>

    <button
        type="button"
        class="
            manage-toggle-status
            ${isActive ? "disable" : "enable"}
        "
        data-product-id="${escapeAdminHtml(product.firestoreId)}"
        data-current-status="${isActive ? "active" : "disabled"}"
    >
        ${isActive ? "Disable" : "Enable"}
    </button>

</div>


<div
    class="manage-product-editor hidden"
    data-editor-id="${escapeAdminHtml(product.firestoreId)}"
>

    <div class="manage-editor-grid">

        <div class="manage-editor-field">

            <label>
                Price per Unit (OMR)
            </label>

            <input
                type="number"
                class="manage-edit-price"
                min="0"
                step="0.001"
                value="${escapeAdminHtml(price)}"
                placeholder="0.000"
            >

        </div>


        <div class="manage-editor-field">

            <label>
                Stock Quantity
            </label>

            <input
                type="number"
                class="manage-edit-stock"
                min="0"
                step="1"
                value="${escapeAdminHtml(stockQuantity)}"
                placeholder="0"
            >

        </div>

    </div>


    <div class="manage-editor-field">

        <label>
            Description EN
        </label>

        <textarea
            class="manage-edit-description-en"
            rows="4"
            placeholder="Product description in English"
        >${escapeAdminHtml(descriptionEn)}</textarea>

    </div>


    <div class="manage-editor-field">

        <label>
            Description AR
        </label>

        <textarea
            class="manage-edit-description-ar"
            rows="4"
            dir="rtl"
            placeholder="وصف المنتج باللغة العربية"
        >${escapeAdminHtml(descriptionAr)}</textarea>

    </div>


    <div class="manage-editor-actions">

        <button
            type="button"
            class="manage-save-details"
            data-product-id="${escapeAdminHtml(product.firestoreId)}"
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

                    getAdminProductName(product),

                    product.nameAr,

                    product.productNameAr,

                    product.category,

                    product.subcategory,

                    product.brand,

                    product.sku,

                    product.productSku,

                    product.productId

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

        /* =========================================
           OPEN / CLOSE PRODUCT EDITOR
           ========================================= */

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

            const willOpen =
                editor.classList.contains("hidden");

            editor.classList.toggle("hidden");

            editButton.textContent =
                willOpen
                    ? "Close Details"
                    : "Edit Details";

            return;
        }


        /* =========================================
           SAVE PRICE / STOCK / DESCRIPTIONS
           ========================================= */

        const saveButton =
            event.target.closest(
                ".manage-save-details"
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


            const priceInput =
                editor.querySelector(
                    ".manage-edit-price"
                );

            const stockInput =
                editor.querySelector(
                    ".manage-edit-stock"
                );

            const descriptionEnInput =
                editor.querySelector(
                    ".manage-edit-description-en"
                );

            const descriptionArInput =
                editor.querySelector(
                    ".manage-edit-description-ar"
                );


            const price =
                Number.parseFloat(
                    priceInput.value
                );

            const stockQuantity =
                Number.parseInt(
                    stockInput.value,
                    10
                );


            if (
                Number.isNaN(price) ||
                price < 0
            ) {

                alert(
                    "Please enter a valid price."
                );

                priceInput.focus();

                return;
            }


            if (
                Number.isNaN(stockQuantity) ||
                stockQuantity < 0
            ) {

                alert(
                    "Please enter a valid stock quantity."
                );

                stockInput.focus();

                return;
            }


            const descriptionEn =
                descriptionEnInput
                    .value
                    .trim();

            const descriptionAr =
                descriptionArInput
                    .value
                    .trim();


            saveButton.disabled = true;

            const originalText =
                saveButton.textContent;

            saveButton.textContent =
                "Saving...";


            try {

                await updateDoc(
                    doc(
                        db,
                        "products",
                        firestoreId
                    ),
                    {
                        price,
                        stockQuantity,
                        descriptionEn,
                        descriptionAr
                    }
                );


                const localProduct =
                    adminProducts.find(
                        product =>
                            product.firestoreId ===
                            firestoreId
                    );


                if (localProduct) {

                    localProduct.price =
                        price;

                    localProduct.stockQuantity =
                        stockQuantity;

                    localProduct.descriptionEn =
                        descriptionEn;

                    localProduct.descriptionAr =
                        descriptionAr;
                }


                saveButton.textContent =
                    "Saved ✓";


                setTimeout(
                    () => {

                        saveButton.textContent =
                            originalText;

                        saveButton.disabled =
                            false;

                    },
                    1200
                );


            } catch (error) {

                console.error(
                    "Unable to save product details:",
                    error
                );

                alert(
                    "Unable to save product details."
                );

                saveButton.textContent =
                    originalText;

                saveButton.disabled =
                    false;
            }


            return;
        }


        /* =========================================
           ENABLE / DISABLE PRODUCT
           ========================================= */

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
                ? "disabled"
                : "active";


        statusButton.disabled = true;

        statusButton.textContent =
            newStatus === "disabled"
                ? "Disabling..."
                : "Enabling...";


        try {

            await updateDoc(
                doc(
                    db,
                    "products",
                    firestoreId
                ),
                {
                    status: newStatus
                }
            );


            const product =
                adminProducts.find(
                    item =>
                        item.firestoreId ===
                        firestoreId
                );


            if (product) {

                product.status =
                    newStatus;
            }


            const searchValue =
                manageProductsSearch
                    ?.value
                    .trim()
                    .toLowerCase();


            if (searchValue) {

                manageProductsSearch
                    .dispatchEvent(
                        new Event("input")
                    );

            } else {

                renderManageProducts(
                    adminProducts
                );
            }


        } catch (error) {

            console.error(
                "Unable to update product status:",
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

    return uploadResult.url;
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


additionalImagesInput.addEventListener(
    "change",
    async () => {

        additionalImagesPreview.innerHTML = "";

        additionalImageUrls = [];

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

                const uploadedUrl =
                    await uploadAdditionalImageToImageKit(
                        file
                    );


                /* =====================================
                   SAVE URL IN ARRAY
                ===================================== */

                additionalImageUrls.push(
                    uploadedUrl
                );


                /* -----------------------------------------
                   Replace preview with ImageKit URL
                ----------------------------------------- */

                URL.revokeObjectURL(
                    previewUrl
                );

                img.src =
                    uploadedUrl;


                console.log(
                    "Additional image uploaded:",
                    uploadedUrl
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
