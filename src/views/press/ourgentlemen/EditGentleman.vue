<template>
  <div class="w-full h-screen flex items-center justify-center text-[16px] leading-[150%] text-center font-semibold"
    v-if="loading">
    Loading gentleman...
  </div>
  <section v-else class="w-full min-h-screen h-fit flex flex-col">
    <!-- header -->
    <div class="w-full flex items-center justify-between px-[24px] py-[20px] border-b-[1px] border-b-[#e4e4e7]">
      <h1 class="text-[16px] font-extrabold uppercase leading-[150%]">Our Gentlemen</h1>
      <!-- Mobile Nav Hamburger toggle -->
      <div @click="contentStore.handleShowNav()" class="block lg:hidden w-[28px] h-[22px]">
        <img src="../../../assets/svgs/navbar/hamburger-menu.svg" alt="nav-menu-icon" />
      </div>
    </div>

    <!-- Form Section -->
    <div class="w-full flex flex-col gap-[24px] p-[24px]">
      <div class="w-full flex items-center justify-between">
        <h2 class="text-[16px] font-semibold leading-[150%]">
          Edit Gentleman
        </h2>
        <!-- Go Back -->
        <button @click="$router.go(-1)" class="btn-prim px-[16px] py-[8px]">
          Go Back
        </button>
      </div>

      <!-- Input field -->
      <div class="w-full flex flex-col gap-[32px]">

        <!-- Name -->
        <div class="flex flex-col gap-[8px] w-full">
          <label class="font-semibold text-[14px] leading-[100%]" for="name">1. Name</label>
          <input class="input" type="text" id="name" name="name" v-model="name"
            placeholder="Enter gentleman's name here" required autocomplete="off" />
        </div>

        <!-- Instagram Handle -->
        <div class="flex flex-col gap-[8px] w-full">
          <label class="font-semibold text-[14px] leading-[100%]" for="igHandle">2. IG Handle</label>
          <input class="input" type="text" id="igHandle" name="igHandle" v-model="igHandle"
            placeholder="Enter gentleman's IG Handle" required autocomplete="off" />
        </div>

        <!-- Gentleman Photo -->
        <div class="flex flex-col gap-[8px] w-full">
          <label class="font-semibold text-[14px] leading-[100%]" for="gentlemansPhoto">4. Gentleman's Photo</label>
          <input class="input" type="file" id="gentlemansPhoto" name="gentlemansPhoto" ref="gentlemansPhoto"
            @change="handleCoverPhotoUpload" accept=".png, .jpg, .jpeg, .webp" />
          <p class="text-[12px] opacity-50 font-normal">
            Please upload an image that is less than 500kb. Accepted file types
            are .png, .jpg, .jpeg, .webp
          </p>

          <!-- Image preview -->
          <div v-show="gentlemansPhotoUrl"
            class="w-full md:w-[470px] h-[240px] md:h-[315px] bg-black/5 rounded-[4px] overflow-clip">
            <img class="size-full object-cover" :src="gentlemansPhotoUrl"
              alt="Your selected images will be displayed here" />
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex items-center gap-[16px] self-end">
        <button @click="cancelGentleman" class="btn-sec px-[16px] py-[8px]">
          Cancel
        </button>
        <button @click="updateGentleman" class="btn-prim px-[16px] py-[8px]">
          Update
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
import { doc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { serverTimestamp } from "firebase/firestore";

export default {
  name: "Edit-Gentleman",
  data() {
    return {
      routeId: null,
      selectedGentlemanId: null,
      matchedGentleman: null,
      loading: false,

      contentStore: useContentStore(),
      userStore: useUserStore(),

      name: "",
      igHandle: "",
      gentlemansPhotoFile: null,
      gentlemansPhotoUrl: null,
      currentFirebaseImageUrl: null,
    };
  },

  async created() {
    this.loading = true;
    try {
      this.routeId = this.$route.params.id;

      if (!this.contentStore.ourGentlemen.length) {
        await this.contentStore.fetchGentlemen();
      }

      const matchedGentleman = this.contentStore.ourGentlemen.find(
        (gentleman) => gentleman.id === this.routeId
      );

      if (matchedGentleman) {
        this.matchedGentleman = matchedGentleman;
        this.selectedGentlemanId = matchedGentleman.id;
        this.name = matchedGentleman.name;
        this.igHandle = matchedGentleman.igHandle;
        this.gentlemansPhotoUrl = matchedGentleman.gentlemansPhotoUrl;
        this.currentFirebaseImageUrl = matchedGentleman.gentlemansPhotoUrl;
      } else {
        this.contentStore.showStatusModal = true;
        this.contentStore.statusMessage = "The gentleman was not found.";
        this.contentStore.statusState = "error";
      }
    } catch (error) {
      this.contentStore.showStatusModal = true;
      this.contentStore.statusMessage =
        "An error occurred while loading the gentleman.";
      this.contentStore.statusState = "error";
    } finally {
      this.loading = false;
    }
  },

  methods: {
    // Method to validate form entries
    validateEntries() {
      if (
        !this.name ||
        !this.igHandle ||
        !this.gentlemansPhotoUrl
      ) {
        return false;
      }

      return true;
    },

    cancelGentleman() {
      this.$router.push({ name: "our-gentlemen" });
    },

    // Method to handle cover photo upload
    handleCoverPhotoUpload() {
      const imageFile = this.$refs.gentlemansPhoto.files[0];

      // 500KB limit check
      if (imageFile.size > 500 * 1024) {
        this.contentStore.statusMessage =
          "Image size exceeds 500KB limit. Please select a smaller image.";
        this.contentStore.statusState = "error";
        this.contentStore.showStatusModal = true;

        this.$refs.gentlemansPhoto.value = null;
        this.gentlemansPhotoFile = null;
        this.gentlemansPhotoUrl = null;
        return;
      }

      const imageURL = URL.createObjectURL(imageFile);
      this.gentlemansPhotoFile = imageFile;
      this.gentlemansPhotoUrl = imageURL;
    },

    async updateGentleman() {
      this.contentStore.startLoading();

      // Validate form inputs
      if (!this.validateEntries()) {
        this.contentStore.statusMessage =
          "Please fill in all required fields.";
        this.contentStore.statusState = "error";
        this.contentStore.showStatusModal = true;
        this.contentStore.stopLoading();
        return;
      }

      //Prevent unecessary requests
      if (this.matchedGentleman) {
        if (
          this.name === this.matchedGentleman.name &&
          this.igHandle === this.matchedGentleman.igHandle &&
          this.gentlemansPhotoUrl === this.matchedGentleman.gentlemansPhotoUrl
        ) {
          this.contentStore.statusMessage =
            "No changes detected to update. Ensure you have made some changes.";
          this.contentStore.statusState = "error";
          this.contentStore.showStatusModal = true;
          this.contentStore.stopLoading();
          return;
        }
      }

      try {
        let gentlemansPhotoUrl = this.gentlemansPhotoUrl;
        // Prepare Firestore document
        const newGentlemanRef = doc(db, "ourgentlemen", this.selectedGentlemanId);

        // Only upload if a new image was selected
        if (this.gentlemansPhotoFile) {
          // Delete the old image first if it exists
          if (
            this.selectedGentlemanId &&
            this.currentFirebaseImageUrl &&
            this.currentFirebaseImageUrl.includes("firebasestorage")
          ) {
            try {
              const oldImageRef = ref(storage, this.currentFirebaseImageUrl);
              await withTimeout(deleteObject(oldImageRef));
            } catch (e) {
              console.warn("Old image could not be deleted:", e);
            }
          }
          const storageRef = ref(
            storage,
            `OurGentlemenImages/${Date.now()}_${this.gentlemansPhotoFile.name}`
          );
          const snapshot = await withTimeout(
            uploadBytes(storageRef, this.gentlemansPhotoFile)
          );
          gentlemansPhotoUrl = await withTimeout(getDownloadURL(snapshot.ref));
        }

        this.currentFirebaseImageUrl = gentlemansPhotoUrl;

        const gentlemanData = {
          id: newGentlemanRef.id,
          name: this.name,
          igHandle: this.igHandle,
          gentlemansPhotoUrl: gentlemansPhotoUrl,
          updatedAt: serverTimestamp(),
          updatedBy:
            this.userStore.userFirstName + " " + this.userStore.userLastName,
        };

        await withTimeout(updateDoc(newGentlemanRef, gentlemanData));
        await this.contentStore.fetchGentlemen();

        this.contentStore.statusState = "success";
        this.contentStore.statusMessage =
          "Your gentleman has been updated successfully";
        this.contentStore.showStatusModal = true;
      } catch (error) {
        this.contentStore.statusState = "error";
        this.contentStore.statusMessage =
          "There was a problem updating your gentleman. Please try again.";
        this.contentStore.showStatusModal = true;
      } finally {
        this.contentStore.stopLoading();
      }
    },
  },
};
</script>
