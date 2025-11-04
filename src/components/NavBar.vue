<template>
  <transition name="fade">
    <nav v-show="contentStore.showNav"
      class="w-full lg:w-[270px] min-h-screen lg:h-screen flex flex-col border-r-[1px] border-r-[#e4e4e7] fixed lg:sticky top-0 left-0 bg-white z-40 lg:z-0">
      <div class="flex flex-col h-screen lg:h-full overflow-y-scroll lg:overflow-visible">
        <!-- Logo and close button -->
        <div
          class="w-full flex items-center justify-between px-[24px] lg:px-[14px] py-[8px] border-b-[1px] border-b-[#e4e4e7]">
          <!-- Logo -->
          <div class="w-fit flex items-center gap-[8px]">
            <div class="size-[48px] overflow-clip flex items-center justify-center">
              <div class="size-[50px]">
                <img class="size-full object-cover" src="../assets/svgs/logo.svg" alt="Logo" />
              </div>
            </div>
            <!-- <p class="uppercase font-extrabold tracking-tighter text-[12px]">
              Radiant Academy
            </p> -->
          </div>
          <!-- Close Icon -->
          <div @click="contentStore.handleShowNav()" class="block lg:hidden size-[30px]">
            <img class="size-full object-cover" src="../assets/svgs/close.svg" alt="Close" />
          </div>
        </div>
        <!-- Mobile User Menu -->
        <div class="w-full flex lg:hidden flex-col items-center px-[24px] pt-[48px] pb-[24px]">
          <!-- User -->
          <div class="flex flex-col items-center gap-[8px]">
            <!-- Initials Icon -->
            <div class="flex items-center justify-center size-[64px] rounded-[8px] bg-black/10">
              <p class="text-[18px] leading-[130%] font-semibold">
                {{ userStore.userInitials }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-[14px] leading-[120%] font-semibold">
                {{ userStore.userFirstName }}
              </p>
              <p class="text-[12px] leading-[120%]">
                {{ userStore.userEmail }}
              </p>
            </div>
            <button @click="confirmSignOut"
              class="w-full flex items-center gap-[8px] justify-center px-[8px] py-[6px] text-[14px] leading-[150%]">
              <div class="size-[22px] lg:size-[16px]">
                <img class="size-full object-cover" src="../assets/svgs/navbar/sign-out.svg" alt="sign-out-icon" />
              </div>
              Sign Out
            </button>
          </div>
        </div>
        <!--Nav Links -->
        <div class="w-full h-fit flex flex-col gap-[8px] px-[24px] pb-[240px] lg:pb-0 lg:px-0">
          <!-- Platform -->
          <div class="w-full p-[8px] flex flex-col">
            <div class="w-full p-[8px]">
              <p class="text-[14px] lg:text-[12px] leading-[130%] opacity-50">
                Platform
              </p>
            </div>
            <div class="w-full flex flex-col gap-[8px] lg:gap-[4px]">
              <!-- Dashboard -->
              <router-link class="route gap-[12px] lg:gap-[8px] text-[16px] font-medium lg:font-normal lg:text-[14px]"
                :to="{ name: 'dashboard' }">
                <div class="size-[22px] lg:size-[16px]">
                  <img class="size-full object-cover" src="../assets/svgs/navbar/dashboard.svg" alt="dashboard-icon" />
                </div>
                Dashboard
              </router-link>
              <!-- Settings -->
              <!-- <router-link
                class="route gap-[12px] lg:gap-[8px] text-[16px] font-medium lg:font-normal lg:text-[14px]"
                :to="{ name: 'settings' }"
              >
                <div class="size-[22px] lg:size-[16px]">
                  <img
                    class="size-full object-cover"
                    src="../assets/svgs/navbar/settings.svg"
                    alt="settings-icon"
                  />
                </div>
                Settings</router-link
              > -->
              <!-- Help -->
              <!-- <router-link
                class="route gap-[12px] lg:gap-[8px] text-[16px] font-medium lg:font-normal lg:text-[14px]"
                :to="{ name: 'help' }"
              >
                <div class="size-[22px] lg:size-[16px]">
                  <img
                    class="size-full object-cover"
                    src="../assets/svgs/navbar/help.svg"
                    alt="help-icon"
                  />
                </div>
                Help</router-link
              > -->
            </div>
          </div>
          <!-- Shop -->
          <div class="w-full p-[8px] flex flex-col">
            <div class="w-full p-[8px]">
              <p class="text-[14px] lg:text-[12px] leading-[130%] opacity-50">
                Shop
              </p>
            </div>
            <div class="w-full flex flex-col gap-[8px] lg:gap-[4px]">
              <!-- Orders -->
              <router-link class="route gap-[12px] lg:gap-[8px] text-[16px] font-medium lg:font-normal lg:text-[14px]"
                :to="{ name: 'orders' }">
                <div class="size-[22px] lg:size-[16px]">
                  <img class="size-full object-cover" src="../assets/svgs/navbar/orders.svg" alt="orders-icon" />
                </div>
                Orders
              </router-link>
              <!-- Products -->
              <router-link class="route gap-[12px] lg:gap-[8px] text-[16px] font-medium lg:font-normal lg:text-[14px]"
                :to="{ name: 'products' }">
                <div class="size-[22px] lg:size-[16px]">
                  <img class="size-full object-cover" src="../assets/svgs/navbar/products.svg" alt="products-icon" />
                </div>
                Products
              </router-link>
            </div>
          </div>
          <!-- Press -->
          <div class="w-full p-[8px] flex flex-col">
            <div class="w-full p-[8px]">
              <p class="text-[14px] lg:text-[12px] leading-[130%] opacity-50">
                Press
              </p>
            </div>
            <div class="w-full flex flex-col gap-[8px] lg:gap-[4px]">
              <!-- Blog -->
              <router-link class="route gap-[12px] lg:gap-[8px] text-[16px] font-medium lg:font-normal lg:text-[14px]"
                :to="{ name: 'blog' }">
                <div class="size-[22px] lg:size-[16px]">
                  <img class="size-full object-cover" src="../assets/svgs/navbar/blog.svg" alt="blog-icon" />
                </div>
                Blog
              </router-link>
              <!-- Reviews -->
              <router-link class="route gap-[12px] lg:gap-[8px] text-[16px] font-medium lg:font-normal lg:text-[14px]"
                :to="{ name: 'reviews' }">
                <div class="size-[22px] lg:size-[16px]">
                  <img class="size-full object-cover" src="../assets/svgs/navbar/reviews.svg"
                    alt="reviews-icon" />
                </div>
                Reviews
              </router-link>
              <!-- Our Gentlemen -->
              <router-link class="route gap-[12px] lg:gap-[8px] text-[16px] font-medium lg:font-normal lg:text-[14px]"
                :to="{ name: 'our-gentlemen' }">
                <div class="size-[22px] lg:size-[16px]">
                  <img class="size-full object-cover" src="../assets/svgs/navbar/ourgentlemen.svg" alt="ourgentlemen-icon" />
                </div>
                Our Gentlemen
              </router-link>
            </div>
          </div>
          <!-- Pages -->
          <div class="w-full p-[8px] flex flex-col">
            <div class="w-full p-[8px]">
              <p class="text-[14px] lg:text-[12px] leading-[130%] opacity-50">
                Pages
              </p>
            </div>
            <div class="w-full flex flex-col gap-[8px] lg:gap-[4px]">
              <!-- Home -->
              <router-link class="route gap-[12px] lg:gap-[8px] text-[16px] font-medium lg:font-normal lg:text-[14px]"
                :to="{ name: 'home' }">
                <div class="size-[22px] lg:size-[16px]">
                  <img class="size-full object-cover" src="../assets/svgs/navbar/pages.svg" alt="pages-icon" />
                </div>
                Home
              </router-link>
            </div>
          </div>
        </div>
        <!-- Desktop User Menu -->
        <div class="w-full hidden lg:flex items-center mt-auto p-[16px] gap-[8px]">
          <!-- Initials Icon -->
          <div class="flex items-center justify-center size-[40px] rounded-[8px] bg-black/10">
            <p class="text-[14px] leading-[130%] font-bold">
              {{ userStore.userInitials }}
            </p>
          </div>
          <!-- User Details -->
          <div class="flex flex-col">
            <p class="text-[14px] leading-[150%] font-semibold">
              {{ userStore.userName }}
            </p>
            <p class="text-[12px] leading-[130%] font-normal">
              {{ userStore.userEmail.slice(0, 25) }}
            </p>
          </div>
          <!-- Vertical Dots Icon -->
          <div class="size-[22px] lg:size-[16px] relative">
            <img @click="handleShowSignOut" class="size-full object-cover hover:cursor-pointer"
              src="../assets/svgs/navbar/vertical-dots.svg" alt="vertical-dots-icon" />
            <div v-show="showSignOut" id="sign-out"
              class="w-[255px] absolute bg-white rounded-[4px] bottom-[10%] left-[400%] z-50">
              <div class="w-full p-[8px] flex flex-col">
                <div class="w-full flex items-center justify-between p-[8px]">
                  <p class="text-[14px] lg:text-[12px] leading-[130%] opacity-50">
                    Sign Out
                  </p>
                  <div @click="handleShowSignOut" class="size-[12px] hover:cursor-pointer">
                    <img class="size-full object-cover" src="../assets/svgs/close.svg" alt="close-icon" />
                  </div>
                </div>
                <div class="w-full flex flex-col gap-[8px] lg:gap-[4px]">
                  <!-- Sign Out -->
                  <button @click="confirmSignOut"
                    class="route gap-[12px] lg:gap-[8px] text-[16px] font-medium lg:font-normal lg:text-[14px]">
                    <div class="size-[22px] lg:size-[16px]">
                      <img class="size-full object-cover" src="../assets/svgs/navbar/blog.svg" alt="blog-icon" />
                    </div>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </transition>
</template>

<script>
import { useContentStore } from "@/stores/content";
import { useUserStore } from "@/stores/userStore";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { withTimeout } from "@/utils/withTimeout";

export default {
  name: "NavBar",

  data() {
    return {
      contentStore: useContentStore(),
      userStore: useUserStore(),
      showSignOut: false,
    };
  },

  watch: {
    $route() {
      if (window.innerWidth < 1024) {
        this.contentStore.showNav = false;
      }
    },
  },

  created() {
    if (window.innerWidth < 1024) {
      this.contentStore.showNav = false;
    }
  },

  methods: {
    handleShowSignOut() {
      this.showSignOut = !this.showSignOut;
    },

    // Method to handle book deletion
    confirmSignOut() {
      this.handleShowSignOut();
      this.contentStore.confirmationCallback = () => this.signOut();
      this.contentStore.showConfirmationModal = true;
      this.contentStore.confirmationHeader = "Confirm";
      this.contentStore.confirmationMessage =
        "Are you sure you want to sign out?";
      this.contentStore.confirmationActionText = "Sign Out";
    },

    async signOut() {
      try {
        this.contentStore.startLoading();
        await withTimeout(signOut(auth));
        this.$router.push({ name: "authentication" });
      } catch (error) {
        this.contentStore.statusState = "error";
        this.contentStore.statusMessage =
          "There was a problem signing you out. Please Try again";
        this.contentStore.showStatusModal = true;
      } finally {
        this.contentStore.stopLoading();
        this.contentStore.showConfirmationModal = false;
        this.contentStore.confirmationHeader = "";
        this.contentStore.confirmationMessage =
          "";
        this.contentStore.confirmationActionText = "";
      }
    },
  },
};
</script>

<style scoped>
.route {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px 8px;
  border-radius: 4px;
}

.route:hover {
  background-color: #f4f4f5;
}

.router-link-active {
  background-color: #f4f4f5;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.3s ease all;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  /* transform: translateX(-100%); */
}

.fade-enter-to {
  opacity: 1;
  /* transform: translateX(0); */
}
</style>
