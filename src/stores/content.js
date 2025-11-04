// Import Pinia's defineStore function to create a store
import { defineStore } from 'pinia';

// Import Firestore functions for reading, writing, updating, and deleting documents
import { doc, getDoc, getDocs, updateDoc, collection, deleteDoc, query, orderBy, } from 'firebase/firestore';

// Import Storage functions to delete files from Firebase Storage
import { deleteObject, ref as storageRef } from 'firebase/storage';

// Import the configured Firestore and Storage instances from your project setup
import { db, storage } from '../firebase/firebaseConfig';

// ---------------- HELPER FUNCTION ----------------
function withTimeout(promise, ms = 15000) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), ms)
        ),
    ]);
}

// Create and export a new Pinia store called 'content'
export const useContentStore = defineStore('content', {
    // ---------- STORE STATE (the data the app will use) ----------
    state: () => ({
        blogPosts: [],
        blogPostsLoaded: false,
        reviews: [],
        reviewsLoaded: false,
        ourGentlemen: [],
        ourGentlemenLoaded: false,
        products: [],
        productsLoaded: false,
        orders: [],           
        ordersLoaded: false,  
            
        loading: false,           // General loading state, true when an action is happening
        showOverlay: false,       // Controls the visibility of the overlay
        showStatusModal: false,   // Controls the visibility of the status modal
        statusMessage: '',
        statusState: '',
        showConfirmationModal: false,
        confirmationHeader: '',
        confirmationMessage: '',
        confirmationActionText: '',
        confirmationCallback: null,
        redirectCallback: null,
        showNav: true,
    }),

    // ---------- STORE ACTIONS (functions that interact with the state and database) ----------
    actions: {
        // Loader Controls
        startLoading() {
            this.loading = true;
        },

        stopLoading() {
            this.loading = false;
        },

        handleShowNav() {
            this.showNav = !this.showNav;
        },

        closeStatusModal() {
            this.showStatusModal = false;
            this.statusMessage = "";
            this.statusState = "";

            if (this.redirectCallback) {
                this.redirectCallback();   // 👈 now redirect happens after modal closes
                this.redirectCallback = null; // reset
            }
        },

        closeConfirmationModal() {
            this.showConfirmationModal = false;
            this.confirmationMessage = "";
            this.confirmationActionText = "";
        },

        // Fetch all blog posts
        async fetchBlogPosts() {

            try {
                const blogCollectionRef = query(collection(db, "blog"), orderBy("createdAt", "asc"));
                const querySnapshot = await withTimeout(getDocs(blogCollectionRef));

                const blogArray = querySnapshot.docs.map((doc) => ({
                    ...doc.data()
                }));

                this.blogPosts = blogArray;
                this.blogPostsLoaded = true;
            } catch (error) {
                console.error(error.message.includes("timed out")
                    ? "The request took too long. Please check your connection."
                    : "Error fetching blog posts:", error);
            }
        },

        // Delete a blog post and its associated image
        async deleteBlogPost(postId, postCoverPhotoUrl, redirect) {
            try {
                this.loading = true

                const postRef = doc(db, 'blog', postId)
                await withTimeout(deleteDoc(postRef))

                if (postCoverPhotoUrl && postCoverPhotoUrl.includes('firebasestorage')) {
                    try {
                        const fileRef = storageRef(storage, postCoverPhotoUrl)
                        await withTimeout(deleteObject(fileRef))
                    } catch (e) {
                        console.warn('Failed to delete post image from storage:', e)
                    }
                }

                this.blogPosts = this.blogPosts.filter(post => post.id !== postId);
                // Handle Status
                this.showStatusModal = true;
                this.statusMessage = "Your blog post has been deleted successfully";
                this.statusState = "success";

                if (redirect) this.redirectCallback = redirect;

            } catch (error) {
                console.error("Error deleting post:", error);
                this.showStatusModal = true;
                this.statusMessage = error.message.includes("timed out")
                    ? "Deleting the post took too long. Please check your connection."
                    : "Failed to delete post. Please try again.";
                this.statusState = "error";
            } finally {
                this.loading = false;
                // Reset Confirmation Modal State
                this.showConfirmationModal = false;
                this.confirmationHeader = '';
                this.confirmationMessage = '';
                this.confirmationActionText = '';
                this.confirmationCallback = null;
            }
        },

        // Fetch all reviews
        async fetchReviews() {

            try {
                const reviewsCollectionRef = query(collection(db, "reviews"), orderBy("createdAt", "asc"));
                const querySnapshot = await withTimeout(getDocs(reviewsCollectionRef));

                const reviewsArray = querySnapshot.docs.map((doc) => ({
                    ...doc.data()
                }));

                this.reviews = reviewsArray;
                this.reviewsLoaded = true;
            } catch (error) {
                console.error(error.message.includes("timed out")
                    ? "The request took too long. Please check your connection."
                    : "Error fetching reviews:", error);
            }
        },

        // Delete a review and its associated image
        async deleteReview(reviewId, reviewerPhotoUrl, redirect) {
            try {
                this.loading = true

                const reviewsRef = doc(db, 'reviews', reviewId)
                await withTimeout(deleteDoc(reviewsRef))

                if (reviewerPhotoUrl && reviewerPhotoUrl.includes('firebasestorage')) {
                    try {
                        const fileRef = storageRef(storage, reviewerPhotoUrl)
                        await withTimeout(deleteObject(fileRef))
                    } catch (e) {
                        console.warn('Failed to delete review image from storage:', e)
                    }
                }

                this.reviews = this.reviews.filter(review => review.id !== reviewId);
                // Handle Status
                this.showStatusModal = true;
                this.statusMessage = "Your review has been deleted successfully";
                this.statusState = "success";

                if (redirect) this.redirectCallback = redirect;

            } catch (error) {
                console.error("Error deleting review:", error);
                this.showStatusModal = true;
                this.statusMessage = error.message.includes("timed out")
                    ? "Deleting the review took too long. Please check your connection."
                    : "Failed to delete review. Please try again.";
                this.statusState = "error";
            } finally {
                this.loading = false;
                // Reset Confirmation Modal State
                this.showConfirmationModal = false;
                this.confirmationHeader = '';
                this.confirmationMessage = '';
                this.confirmationActionText = '';
                this.confirmationCallback = null;
            }
        },

        // Fetch all gentlemen
        async fetchGentlemen() {

            try {
                const ourGentlemenCollectionRef = query(collection(db, "ourgentlemen"), orderBy("createdAt", "asc"));
                const querySnapshot = await withTimeout(getDocs(ourGentlemenCollectionRef));

                const ourGentlemenArray = querySnapshot.docs.map((doc) => ({
                    ...doc.data()
                }));

                this.ourGentlemen = ourGentlemenArray;
                this.ourGentlemenLoaded = true;
            } catch (error) {
                console.error(error.message.includes("timed out")
                    ? "The request took too long. Please check your connection."
                    : "Error fetching gentlemen:", error);
            }
        },

        // Delete a gentleman and its associated image
        async deleteGentleman(gentlemanId, gentlemanPhotoUrl, redirect) {
            try {
                this.loading = true

                const gentlemanRef = doc(db, 'ourgentlemen', gentlemanId)
                await withTimeout(deleteDoc(gentlemanRef))

                if (gentlemanPhotoUrl && gentlemanPhotoUrl.includes('firebasestorage')) {
                    try {
                        const fileRef = storageRef(storage, gentlemanPhotoUrl)
                        await withTimeout(deleteObject(fileRef))
                    } catch (e) {
                        console.warn('Failed to delete gentleman image from storage:', e)
                    }
                }

                this.ourGentlemen = this.ourGentlemen.filter(gentleman => gentleman.id !== gentlemanId);
                // Handle Status
                this.showStatusModal = true;
                this.statusMessage = "Your gentleman has been deleted successfully";
                this.statusState = "success";

                if (redirect) this.redirectCallback = redirect;

            } catch (error) {
                console.error("Error deleting gentleman:", error);
                this.showStatusModal = true;
                this.statusMessage = error.message.includes("timed out")
                    ? "Deleting the gentleman took too long. Please check your connection."
                    : "Failed to delete gentleman. Please try again.";
                this.statusState = "error";
            } finally {
                this.loading = false;
                // Reset Confirmation Modal State
                this.showConfirmationModal = false;
                this.confirmationHeader = '';
                this.confirmationMessage = '';
                this.confirmationActionText = '';
                this.confirmationCallback = null;
            }
        },

        // Fetch all products
        async fetchProducts() {

            try {
                const productsCollectionRef = query(collection(db, "products"), orderBy("createdAt", "asc"));
                const querySnapshot = await withTimeout(getDocs(productsCollectionRef));

                const productsArray = querySnapshot.docs.map((doc) => ({
                    ...doc.data()
                }));

                this.products = productsArray;
                this.productsLoaded = true;
            } catch (error) {
                console.error(error.message.includes("timed out")
                    ? "The request took too long. Please check your connection."
                    : "Error fetching products:", error);
            }
        },

        // Delete a product and all its associated images
        async deleteProduct(productId, productPhotos, redirect) {
            try {
                this.loading = true;

                // Reference to the Firestore document
                const productRef = doc(db, "products", productId);
                await withTimeout(deleteDoc(productRef));

                // ✅ Delete all associated product photos from Firebase Storage
                if (Array.isArray(productPhotos) && productPhotos.length > 0) {
                    for (const photo of productPhotos) {
                        if (photo.photoUrl && photo.photoUrl.includes("firebasestorage")) {
                            try {
                                const fileRef = storageRef(storage, photo.photoUrl);
                                await withTimeout(deleteObject(fileRef));
                            } catch (err) {
                                console.warn(`Failed to delete product photo: ${photo.photoUrl}`, err);
                            }
                        }
                    }
                }

                // ✅ Remove the deleted product from your local state
                this.products = this.products.filter(product => product.id !== productId);

                // ✅ Success feedback
                this.showStatusModal = true;
                this.statusMessage = "Your product has been deleted successfully.";
                this.statusState = "success";

                // Optional redirect (if provided)
                if (redirect) this.redirectCallback = redirect;

            } catch (error) {
                console.error("Error deleting product:", error);
                this.showStatusModal = true;
                this.statusMessage = error.message.includes("timed out")
                    ? "Deleting the product took too long. Please check your connection."
                    : "Failed to delete product. Please try again.";
                this.statusState = "error";

            } finally {
                this.loading = false;

                // Reset confirmation modal
                this.showConfirmationModal = false;
                this.confirmationHeader = "";
                this.confirmationMessage = "";
                this.confirmationActionText = "";
                this.confirmationCallback = null;
            }
        },


        // Fetch all Orders
        async fetchOrders() {
            try {
                const ordersCollectionRef = query(collection(db, "orders"), orderBy("orderedAt", "asc"));
                const querySnapshot = await withTimeout(getDocs(ordersCollectionRef));

                const ordersArray = querySnapshot.docs.map((doc) => ({
                    ...doc.data()
                }));

                this.orders = ordersArray;
                this.ordersLoaded = true;
            } catch (error) {
                console.error(error.message.includes("timed out")
                    ? "The request took too long. Please check your connection."
                    : "Error fetching orders:", error);
            }
        },



    },
});
