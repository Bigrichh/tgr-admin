<template>
  <section class="w-full min-h-screen h-fit flex flex-col">
    <!-- header -->
    <div class="w-full flex items-center justify-between px-[24px] py-[20px] border-b-[1px] border-b-[#e4e4e7]">
      <h1 class="text-[16px] font-extrabold uppercase leading-[150%]">Reviews</h1>
      <!-- Mobile Nav Hamburger toggle -->
      <div @click="contentStore.handleShowNav()" class="block lg:hidden w-[28px] h-[22px]">
        <img src="../../../assets/svgs/navbar/hamburger-menu.svg" alt="nav-menu-icon" />
      </div>
    </div>

    <!-- Form Section -->
    <div class="w-full flex flex-col gap-[24px] p-[24px]">
      <div class="w-full flex items-center justify-between">
        <h2 class="text-[16px] font-semibold leading-[150%]">
          Add New Review
        </h2>
        <!-- Go Back -->
        <button @click="$router.go(-1)" class="btn-prim px-[16px] py-[8px]">
          Go Back
        </button>
      </div>

      <!-- Input field -->
      <div class="w-full flex flex-col gap-[32px]">
        
        <!-- Review -->
        <div class="flex flex-col gap-[8px] w-full">
          <label class="font-semibold text-[14px] leading-[100%]" for="review">1. Review</label>
          <textarea rows="4" name="review" id="review" placeholder="Enter review here"
            v-model="review" autocomplete="off" required class="input"></textarea>
        </div>
        
        <!-- Reviewer -->
        <div class="flex flex-col gap-[8px] w-full">
          <label class="font-semibold text-[14px] leading-[100%]" for="reviewer">2. Reviewer</label>
          <input class="input" type="text" id="reviewer" name="reviewer" v-model="reviewer"
            placeholder="Enter reviewer's name here" required autocomplete="off" />
        </div>

        <!-- Instagram Handle -->
        <div class="flex flex-col gap-[8px] w-full">
          <label class="font-semibold text-[14px] leading-[100%]" for="igHandle">3. IG Handle</label>
          <input class="input" type="text" id="igHandle" name="igHandle" v-model="igHandle"
            placeholder="Enter reviewer's IG Handle" required autocomplete="off" />
        </div>

        <!-- Reviewer Photo -->
        <div class="flex flex-col gap-[8px] w-full">
          <label class="font-semibold text-[14px] leading-[100%]" for="reviewerPhoto">4. Reviewer Photo</label>
          <input class="input" type="file" id="reviewerPhoto" name="reviewerPhoto" ref="reviewerPhoto"
            @change="handleCoverPhotoUpload" accept=".png, .jpg, .jpeg, .webp" />
          <p class="text-[12px] opacity-50 font-normal">
            Please upload an image that is less than 500kb. Accepted file types
            are .png, .jpg, .jpeg, .webp
          </p>

          <!-- Image preview -->
          <div v-show="reviewerPhotoUrl"
            class="w-full md:w-[470px] h-[240px] md:h-[315px] bg-black/5 rounded-[4px] overflow-clip">
            <img class="size-full object-cover" :src="reviewerPhotoUrl"
              alt="Your selected images will be displayed here" />
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex items-center gap-[16px] self-end">
        <button @click="cancelReview" class="btn-sec px-[16px] py-[8px]">
          Cancel
        </button>
        <button @click="addNewReviewer" class="btn-prim px-[16px] py-[8px]">
          Upload
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { useContentStore } from "@/stores/content";
import { useUserStore } from "@/stores/userStore";

import { withTimeout } from "@/utils/withTimeout";

import { db, storage } from "@/firebase/firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { serverTimestamp } from "firebase/firestore";

export default {
  name: "Add-New-Review",
  data() {
    return {
      contentStore: useContentStore(),
      userStore: useUserStore(),

      review: "",
      reviewer: "",
      igHandle: "",
      reviewerPhotoFile: null,
      reviewerPhotoUrl: null,
    };
  },
  methods: {
    // Method to validate form entries
    validateEntries() {
      if (
        !this.review ||
        !this.reviewer ||
        !this.igHandle ||
        !this.reviewerPhotoUrl
      ) {
        return false;
      }

      return true;
    },

    cancelReview() {
      this.$router.push({ name: "review" });
    },

    // Method to handle cover photo upload
    handleCoverPhotoUpload() {
      const imageFile = this.$refs.reviewerPhoto.files[0];

      // 500KB limit check
      if (imageFile.size > 500 * 1024) {
        this.contentStore.statusMessage =
          "Image size exceeds 500KB limit. Please select a smaller image.";
        this.contentStore.statusState = "error";
        this.contentStore.showStatusModal = true;

        this.$refs.reviewerPhoto.value = null;
        this.reviewerPhotoFile = null;
        this.reviewerPhotoUrl = null;
        return;
      }

      const imageURL = URL.createObjectURL(imageFile);
      this.reviewerPhotoFile = imageFile;
      this.reviewerPhotoUrl = imageURL;
    },

    async addNewReviewer() {
      this.contentStore.startLoading();

      // Validate form inputs
      if (!this.validateEntries()) {
        this.contentStore.statusMessage =
          "Please ensure all the required fields are correctly filled and try again";
        this.contentStore.statusState = "error";
        this.contentStore.showStatusModal = true;
        this.contentStore.stopLoading();
        return;
      }

      try {
        let reviewerPhotoUrl = "";

        // Upload image to Firebase Storage
        if (this.reviewerPhotoFile) {
          const storageRef = ref(
            storage,
            `ReviewerImages/${Date.now()}_${this.reviewerPhotoFile.name}`
          );
          const snapshot = await withTimeout(
            uploadBytes(storageRef, this.reviewerPhotoFile)
          );
          reviewerPhotoUrl = await withTimeout(getDownloadURL(snapshot.ref));
        }

        // Prepare Firestore document
        const newReviewerRef = doc(collection(db, "reviews"));
        const reviewerData = {
          id: newReviewerRef.id,
          review: this.review,
          reviewer: this.reviewer,
          igHandle: this.igHandle,
          reviewerPhotoUrl: reviewerPhotoUrl,
          createdAt: serverTimestamp(),
          uploadedBy:
            this.userStore.userFirstName + " " + this.userStore.userLastName,
        };

        await withTimeout(setDoc(newReviewerRef, reviewerData));
        await this.contentStore.fetchReviews();

        // Reset form
        this.review = "";
        this.reviewer = "";
        this.igHandle = "";
        this.reviewerPhotoFile = null;
        this.reviewerPhotoUrl = null;
        this.$refs.reviewerPhoto.value = null;

        this.contentStore.statusState = "success";
        this.contentStore.statusMessage =
          "Your review has been uploaded successfully";
        this.contentStore.showStatusModal = true;
      } catch (error) {
        this.contentStore.statusState = "error";
        this.contentStore.statusMessage =
          "There was a problem uploading your review. Please try again.";
        this.contentStore.showStatusModal = true;
      } finally {
        this.contentStore.stopLoading();
      }
    },
  },
};
</script>
