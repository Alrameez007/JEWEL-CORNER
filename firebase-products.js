/* =========================================================
   JEWEL CORNER — CUSTOMER FIRESTORE PRODUCT LOADER
   STEP 8A
   ========================================================= */

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    doc,
    writeBatch,
    serverTimestamp,
    getDoc
} from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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

const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/* =========================================================
   CUSTOMER GOOGLE AUTH
   ========================================================= */

window.JewelCornerCustomerAuth = {

    signInWithGoogle: async function () {
        try {
            const result =
                await signInWithPopup(
                    auth,
                    googleProvider
                );

            return result.user;

        } catch (error) {

            console.error(
                "Jewel Corner Google sign-in failed:",
                error
            );

            throw error;
        }
    },

    signOut: async function () {
        await signOut(auth);
    },

    getCurrentUser: function () {
        return auth.currentUser;
    }
};


onAuthStateChanged(auth, user => {

    window.JewelCornerCustomerUser =
        user || null;

    document.dispatchEvent(
        new CustomEvent(
            "jcCustomerAuthChanged",
            {
                detail: {
                    user: user || null
                }
            }
        )
    );
});


/* =========================================================
   CONVERT FIRESTORE PRODUCT
   TO CUSTOMER WEBSITE FORMAT
   ========================================================= */

function convertProduct(productDoc) {

    const data = productDoc.data();

    return {

        firestoreId: productDoc.id,

        id:
            data.productId ||
            data.sku ||
            productDoc.id,

        sku:
            data.sku || "",

        name: {
            en:
                data.nameEn ||
                data.title ||
                "",
            ar:
                data.nameAr ||
                data.nameEn ||
                data.title ||
                ""
        },

        description: {
            en:
                data.descriptionEn ||
                data.description ||
                "",
            ar:
                data.descriptionAr ||
                data.descriptionEn ||
                data.description ||
                ""
        },

        category:
            data.category || "",

        subcategory:
            data.subcategory || "",

        brand:
            data.brand || "",

        image:
            data.mainImage || "",

        additionalImages:
            Array.isArray(data.additionalImages)
                ? data.additionalImages
                : [],

        price:
            data.price ?? "",

        showPrice:
            data.showPrice === true,

        whatsappEnquiry:
            data.whatsappEnquiry !== false,

        featured:
            data.featured === true,

        newArrival:
            data.newArrival === true,

        tags:
            Array.isArray(data.tags)
                ? data.tags
                : [],

        status:
            data.status || "inactive"
    };
}


/* =========================================================
   LOAD PRODUCTS FROM FIRESTORE
   ========================================================= */

async function loadProductsFromFirestore() {

    try {

        const productsQuery =
    query(
        collection(db, "products"),
        where("status", "==", "active")
    );

const snapshot =
    await getDocs(productsQuery);

        const products = [];

        snapshot.forEach(productDoc => {

            const product =
                convertProduct(productDoc);

            /*
             * Customer website should never receive
             * inactive products.
             */

            if (product.status === "active") {
                products.push(product);
            }

        });

        window.PRODUCTS = products;

        console.log(
            `Jewel Corner: ${products.length} active products loaded from Firestore.`
        );

        document.dispatchEvent(
            new CustomEvent(
                "jcProductsLoaded",
                {
                    detail: {
                        products
                    }
                }
            )
        );

    } catch (error) {

        console.error(
            "Jewel Corner Firestore product loading failed:",
            error
        );

        window.PRODUCTS = [];

        document.dispatchEvent(
            new CustomEvent(
                "jcProductsLoadError",
                {
                    detail: {
                        error
                    }
                }
            )
        );
    }
}


/* =========================================================
   START
   ========================================================= */

loadProductsFromFirestore();
