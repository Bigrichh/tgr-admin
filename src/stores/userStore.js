import { defineStore } from 'pinia';  // Import Pinia's defineStore to create a store
import { auth, db } from '../firebase/firebaseConfig';  // Import Firebase Authentication and Firestore
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';  // Import Firestore functions for reading documents
// import { useContentStore } from "./content";

// ---------------- HELPER FUNCTION ----------------
function withTimeout(promise, ms = 15000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    ),
  ]);
}

// Define a Pinia store for managing user data
export const useUserStore = defineStore('userStore', {
  state: () => ({
    authReady: false,
    allUsers: null,
    allUsersLoaded: false,
    user: null,  // Holds the authenticated user object
    lastActive: null,
    userEmail: null,  // Stores the user's email
    userFirstName: null,  // Stores the user's first name
    userLastName: null,  // Stores the user's last name
    userName: null,  // Stores the user's username
    userRole: null,  // Stores the user's role (e.g., admin, user)
    userId: null,  // Stores the user's unique ID (uid from Firebase Authentication)
    userInitials: null,  // Stores the initials of the user (first and last initials)
    master: null,
    lastActive: null,
  }),

  getters: {
    // Quick way to check if user is logged in
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    // Reusable setter for user data
    setUser(data) {
      this.user = data?.user || null;
      this.userEmail = data?.email || null;
      this.userFirstName = data?.firstName || null;
      this.userLastName = data?.lastName || null;
      this.userName = data?.userName || null;
      this.userId = data?.userId || null;
      this.userInitials = data?.initials || null;
      this.userRole = data?.userRole || null;
      this.lastActive = data?.lastActive || null;
      this.master = data?.master || null;
    },

    // Clears all state back to defaults
    clearUser() {
      this.$reset(); // Pinia built-in reset
    },

    // Fetch the current user from Firebase Auth + Firestore
    async getCurrentUser() {
      // const contentStore = useContentStore();
      try {
        // contentStore.startLoading(); // turn on loader
        const currentUser = auth.currentUser;

        if (currentUser) {
          // Fetch Firestore user profile
          const userDocRef = await getDoc(doc(db, "users", currentUser.uid));

          if (userDocRef.exists()) {
            const data = userDocRef.data();

            this.setUser({
              user: currentUser,
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              userName: data.userName,
              userId: currentUser.uid,
              initials: `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`,
              userRole: data.userRole,
              lastActive: data.lastActive,
              master: data.master,
            });
          } else {
            console.error("User document does not exist in Firestore.");
          }
        } else {
          this.clearUser(); // Reset if no user is logged in
        }
      } catch (error) {
        console.error("An error occurred while fetching the current user:", error);
      } finally {
        this.authReady = true; // <-- mark done
        // contentStore.stopLoading(); // turn off loader
      }
    },

    async fetchAllUsers() {
      try {
        const querySnapshot = await withTimeout(getDocs(collection(db, "users")));

        const users = querySnapshot.docs.map(doc => ({
          id: doc.id,   // UID from Firestore
          ...doc.data() // user fields (email, firstName, lastName, etc.)
        }));

        this.allUsers = users;
        this.allUsersLoaded = true;
        return users; // in case you want to use it directly
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    }
  }
});
