<template>
  <section class="w-full h-screen flex">
    <!-- Left Section -->
    <div class="w-1/2 h-full hidden lg:flex flex-col items-start justify-between px-[80px] py-[40px] bg-[#FAFAFA]">
      <!-- Logo -->
      <div class="flex items-center gap-[8px]">
        <!-- Logo -->
        <div class="size-[50px]">
          <img class="size-full object-cover" src="../assets/svgs/logo.svg" alt="Logo" />
        </div>
        <!-- <p class="uppercase font-extrabold tracking-tighter">The Gentlemen's Room</p> -->
      </div>
      <p class="leading-[140%] text-[14px] font-semibold">
        Welcome to the TGR Admin Panel. Log In to get started.
      </p>
    </div>
    <!-- Right Section -->
    <div class="w-full lg:w-1/2 flex flex-col items-center justify-between lg:justify-center">
      <!-- Logo -->
      <div
        class="w-full flex lg:hidden items-center gap-[8px] px-[24px] md:px-[120px] py-[14px] border-b-[1px] border-b-[#e4e4e7] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <!-- Logo -->
        <div class="size-[50px]">
          <img class="size-full object-cover" src="../assets/svgs/logo.svg" alt="Logo" />
        </div>
        <!-- <p class="uppercase font-extrabold tracking-tighter text-[14px]">
          TGR
        </p> -->
      </div>

      <!-- Form -->
      <form @submit.prevent="signIn"
        class="w-full lg:w-[350px] px-[24px] md:px-[120px] lg:px-0 flex flex-col gap-[24px]">
        <div class="flex flex-col gap-[8px] text-center items-center">
          <h1 class="text-[24px] font-bold leading-[132%]">Log In</h1>
          <p class="leading-[140%] text-[14px] font-normal opacity-50">
            Authorized users only. Please Enter your email and password below to
            continue
          </p>
        </div>

        <div class="w-full flex flex-col gap-[8px]">
          <input class="input" type="email" name="email" v-model="email" placeholder="Enter your admin email"
            required />
          <input class="input" type="password" name="password" v-model="password"
            placeholder="Enter your admin password" required />

          <button class="px-[16px] py-[8px] btn-prim">Sign In</button>

          <!-- Show Error Message if there is an error -->
          <span v-show="error" class="text-[14px] font-bold !text-red-600">{{
            errorMsg
          }}</span>
        </div>
      </form>

      <div class="w-full block lg:hidden px-[24px] md:px-[120px] pb-[48px] md:pb-[80px]">
        <p class="leading-[140%] text-[12px] md:text-[14px] lg:font-semibold">
          Welcome to the TGR Admin Panel. Log In to get started.Welcome to the TGR Admin Panel. Log In to get started.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig.js";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useContentStore } from "@/stores/content";
import { useUserStore } from "@/stores/userStore";

export default {
  name: "Authentication",

  data() {
    return {
      email: null,
      password: null,
      error: false,
      errorMsg: "",
      contentStore: useContentStore(),
      userStore: useUserStore(),
    };
  },

  methods: {
    // Handle sign-in logic
    async signIn() {
      this.contentStore.startLoading();

      // Validate that both fields are filled
      if (!this.email || !this.password) {
        this.error = true;
        this.errorMsg = "Please fill out all the fields!";
        this.contentStore.stopLoading();

        // Auto-clear error after 5 seconds
        setTimeout(() => {
          this.error = false;
          this.errorMsg = "";
        }, 5000);
        return;
      }

      try {
        // Sign in with firebase
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );

        const user = userCredential.user;

        //  Update Firestore with lastActive timestamp
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          lastActive: serverTimestamp(),
        });

        // First, load user profile
        await this.userStore.getCurrentUser();

        // Fetch all users for permissions
        await this.userStore.fetchAllUsers();

        await this.$router.replace({ name: "dashboard" });
      } catch (error) {
        // Handle sign-in errors
        this.error = true;
        this.errorMsg = "Error signing in user: " + error.message;
        this.contentStore.stopLoading();

        setTimeout(() => {
          this.error = false;
          this.errorMsg = "";
        }, 5000);
      }
    },
  },
};
</script>
