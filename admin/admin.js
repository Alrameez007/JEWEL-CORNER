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

    } catch (error) {

      console.error(error);
    }
  }
);


/* =========================================================
   AUTH STATE
   ========================================================= */

onAuthStateChanged(
  auth,
  user => {

    if (user) {

      loginPage.classList.add("hidden");
      dashboardPage.classList.remove("hidden");

    } else {

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

        showPrice:
          document
            .getElementById("showPrice")
            .checked,

        mainImage:
          document
            .getElementById("productMainImage")
            .value
            .trim(),

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
const additionalImagesInput = document.getElementById("additionalImages");
const additionalImagesPreview = document.getElementById("additionalImagesPreview");

additionalImagesInput.addEventListener("change", () => {
    additionalImagesPreview.innerHTML = "";

    const files = Array.from(additionalImagesInput.files);

    files.forEach((file) => {
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const img = document.createElement("img");

            img.src = event.target.result;
            img.alt = "Additional product image preview";

            img.style.width = "100px";
            img.style.height = "100px";
            img.style.objectFit = "contain";
            img.style.borderRadius = "8px";
            img.style.border = "1px solid #ddd";
            img.style.background = "#F4F0E4";
            img.style.padding = "4px";

            additionalImagesPreview.appendChild(img);
        };

        reader.readAsDataURL(file);
    });
});
