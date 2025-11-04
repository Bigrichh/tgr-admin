<template>
  <ConfirmationModal v-show="contentStore.showConfirmationModal" :message="contentStore.confirmationMessage"
    :header="contentStore.confirmationHeader" :actionText="contentStore.confirmationActionText"
    @close="contentStore.closeConfirmationModal()" @confirm="contentStore.confirmationCallback()"></ConfirmationModal>
  <StatusModal v-show="contentStore.showStatusModal" :message="contentStore.statusMessage"
    :state="contentStore.statusState" @close="contentStore.closeStatusModal()"></StatusModal>
  <Overlay v-if="contentStore.showOverlay === true"></Overlay>
  <!-- Show loading spinner when loading -->
  <Loading v-if="contentStore.loading === true"></Loading>
  <div class="w-full flex flex-col lg:flex-row min-h-screen bg-white relative">
    <NavBar v-if="userStore.isLoggedIn && !$route.meta.hideNav" />
    <div class="flex-1">
      <RouterView />
    </div>
  </div>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { auth } from "./firebase/firebaseConfig.js"; // Correct import path
import { useUserStore } from "@/stores/userStore"; // Import Pinia store
import { useContentStore } from "@/stores/content";

import Loading from "./components/Loading.vue";
import NavBar from "./components/NavBar.vue";
import Overlay from "./components/Overlay.vue";
import StatusModal from "./components/StatusModal.vue";
import ConfirmationModal from "./components/ConfirmationModal.vue";

export default {
  name: "App",
  components: {
    Loading,
    NavBar,
    Overlay,
    StatusModal,
    ConfirmationModal,
  },

  data() {
    return {
      contentStore: useContentStore(), // Define contentStore in data
      userStore: useUserStore(), // Define userStore in data
    };
  },

  created() {
    // onAuthStateChanged listens for changes in the authentication state and fires the callback function.
    // Use onAuthStateChanged to get the current user and current user details from the database and store it in state
    onAuthStateChanged(auth, async (user) => {
      // If a user is logged in, we dispatch getCurrentUser to fetch the user's profile information from Firestore and update the user state
      if (user) {
        await this.userStore.getCurrentUser();

        // Then fetch other stuff in parallel
        await Promise.all([
          this.contentStore.fetchBlogPosts(),
          this.contentStore.fetchReviews(),
          this.contentStore.fetchGentlemen(),
          this.contentStore.fetchProducts(),
          this.contentStore.fetchOrders(),
          this.userStore.fetchAllUsers(),
        ]);
      }
    });
  },
};
</script>
