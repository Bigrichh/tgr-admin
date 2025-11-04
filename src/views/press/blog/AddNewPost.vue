<template>
  <section class="w-full min-h-screen h-fit flex flex-col">
    <!-- header -->
    <div class="w-full flex items-center justify-between px-[24px] py-[20px] border-b-[1px] border-b-[#e4e4e7]">
      <h1 class="text-[16px] font-extrabold uppercase leading-[150%]">Blog</h1>
      <!-- Mobile Nav Hamburger toggle -->
      <div @click="contentStore.handleShowNav()" class="block lg:hidden w-[28px] h-[22px]">
        <img src="../../../assets/svgs/navbar/hamburger-menu.svg" alt="nav-menu-icon" />
      </div>
    </div>

    <!-- Form Section -->
    <div class="w-full flex flex-col gap-[24px] p-[24px]">
      <div class="w-full flex items-center justify-between">
        <h2 class="text-[16px] font-semibold leading-[150%]">
          Add New Post
        </h2>
        <!-- Go Back -->
        <button @click="$router.go(-1)" class="btn-prim px-[16px] py-[8px]">
          Go Back
        </button>
      </div>

      <!-- Input field -->
      <div class="w-full flex flex-col gap-[32px]">
        <!-- Post Title -->
        <div class="flex flex-col gap-[8px] w-full">
          <label class="font-semibold text-[14px] leading-[100%]" for="title">1. Post Title</label>
          <input class="input" type="text" id="title" name="title" v-model="title"
            placeholder="e.g The Story Behind The Gentlemen’s Room" required autocomplete="off" />
        </div>

        <!-- Description input -->
        <div class="flex flex-col gap-[8px] w-full">
          <label class="font-semibold text-[14px] leading-[100%]" for="description">2. Description</label>
          <textarea rows="4" name="description" id="description" placeholder="e.g Why we started and where we’re headed"
            v-model="description" autocomplete="off" required class="input"></textarea>
          <p class="text-[12px] opacity-50 font-normal">
            Provide a brief description of the blog post. Keep it short.
          </p>
        </div>

        <!-- Category Selection -->
        <div class="flex flex-col gap-[8px] w-full">
          <label class="font-semibold text-[14px] leading-[100%]" for="category">3. Category</label>
          <!-- Input -->
          <div class="relative w-full">
            <select id="category" v-model="category" class="input w-full appearance-none">
              <option disabled value="">Select an option</option>
              <option value="Behind the Room">
                Behind the Room
              </option>
              <option value="Career">Career</option>
              <option value="Graduation">
                Graduation
              </option>
              <option value="Gentlemen’s Style Guide">Gentlemen’s Style Guide</option>
            </select>

            <!-- Chevron -->
            <div class="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2">
              <img src="../../../assets/svgs/chevron-down.svg" alt="chevron-icon" />
            </div>
          </div>
        </div>

        <!-- Post Cover Photo -->
        <div class="flex flex-col gap-[8px] w-full">
          <label class="font-semibold text-[14px] leading-[100%]" for="postCoverPhoto">4. Post Cover Photo</label>
          <input class="input" type="file" id="postCoverPhoto" name="postCoverPhoto" ref="postCoverPhoto"
            @change="handleCoverPhotoUpload" accept=".png, .jpg, .jpeg, .webp" />
          <p class="text-[12px] opacity-50 font-normal">
            Please upload an image that is less than 350kb. Accepted file types
            are .png, .jpg, .jpeg, .webp
          </p>

          <!-- Image preview -->
          <div v-show="postCoverPhotoUrl"
            class="w-full md:w-[470px] h-[240px] md:h-[315px] bg-black/5 rounded-[4px] overflow-clip">
            <img class="size-full object-cover" :src="postCoverPhotoUrl"
              alt="Your selected images will be displayed here" />
          </div>
        </div>

        <!-- Qull editor compose blog input -->
        <div class="flex flex-col gap-[8px] w-full">
          <label class="font-semibold text-[14px] leading-[100%]">5. Post Content</label>

          <div>
            <div class="editor">
              <QuillEditor ref="editor" :options="options" :modules="modules" contentType="html"
                v-model:content="postContent" toolbar="full" theme="snow" />
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex items-center gap-[16px] self-end">
        <button @click="cancelPost" class="btn-sec px-[16px] py-[8px]">
          Cancel
        </button>
        <button @click="addNewPost" class="btn-prim px-[16px] py-[8px]">
          Publish
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { useContentStore } from "@/stores/content";
import { useUserStore } from "@/stores/userStore";

import { withTimeout } from "@/utils/withTimeout";

import { QuillEditor } from "@vueup/vue-quill";
import BlotFormatter from "quill-blot-formatter/dist/BlotFormatter";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import { db, storage } from "@/firebase/firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { serverTimestamp } from "firebase/firestore";

export default {
  name: "Add-New-Post",
  components: {
    QuillEditor,
  },
  setup() {
    const modules = {
      name: "blotFormatter",
      module: BlotFormatter,
      options: {
        /* options */
      },
    };
    return { modules };
  },
  data() {
    return {
      contentStore: useContentStore(),
      userStore: useUserStore(),
      options: {
        // debug: 'info',
        placeholder: "Start writing your post here...",
        readOnly: false,
      },

      title: "",
      description: "",
      category: "",
      postContent: "",
      postCoverPhotoFile: null,
      postCoverPhotoUrl: null,
    };
  },
  methods: {
    // Method to validate form entries
    validateEntries() {
      if (
        !this.title ||
        !this.description ||
        !this.category ||
        !this.postCoverPhotoUrl ||
        !this.postContent
      ) {
        return false;
      }

      return true;
    },

    cancelPost() {
      // this.title = "";
      // this.description = "";
      // this.category = "";
      // this.postContent = "<p></p>";

      this.$router.push({ name: "blog" });
    },

    // Method to handle cover photo upload
    handleCoverPhotoUpload() {
      const imageFile = this.$refs.postCoverPhoto.files[0];

      // 350KB limit check
      if (imageFile.size > 350 * 1024) {
        this.contentStore.statusMessage =
          "Image size exceeds 350KB limit. Please select a smaller image.";
        this.contentStore.statusState = "error";
        this.contentStore.showStatusModal = true;

        this.$refs.postCoverPhoto.value = null;
        this.postCoverPhotoFile = null;
        this.postCoverPhotoUrl = null;
        return;
      }

      const imageURL = URL.createObjectURL(imageFile);
      this.postCoverPhotoFile = imageFile;
      this.postCoverPhotoUrl = imageURL;
    },

    async addNewPost() {
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
        let postCoverPhotoUrl = "";

        // Upload image to Firebase Storage
        if (this.postCoverPhotoFile) {
          const storageRef = ref(
            storage,
            `BlogPostImages/${Date.now()}_${this.postCoverPhotoFile.name}`
          );
          const snapshot = await withTimeout(
            uploadBytes(storageRef, this.postCoverPhotoFile)
          );
          postCoverPhotoUrl = await withTimeout(getDownloadURL(snapshot.ref));
        }

        // Prepare Firestore document
        const newPostRef = doc(collection(db, "blog"));
        const postData = {
          id: newPostRef.id,
          title: this.title,
          description: this.description,
          category: this.category,
          postContent: this.postContent,
          postCoverPhotoUrl: postCoverPhotoUrl,
          createdAt: serverTimestamp(),
          uploadedBy:
            this.userStore.userFirstName + " " + this.userStore.userLastName,
        };

        await withTimeout(setDoc(newPostRef, postData));
        await this.contentStore.fetchBlogPosts();

        // Reset form
        this.title = "";
        this.description = "";
        this.category = "";
        this.postContent = "<p></p>";
        this.postCoverPhotoFile = null;
        this.postCoverPhotoUrl = null;
        this.$refs.postCoverPhoto.value = null;

        this.contentStore.statusState = "success";
        this.contentStore.statusMessage =
          "Your blog post has been uploaded successfully";
        this.contentStore.showStatusModal = true;
      } catch (error) {
        this.contentStore.statusState = "error";
        this.contentStore.statusMessage =
          "There was a problem uploading your post. Please try again.";
        this.contentStore.showStatusModal = true;
      } finally {
        this.contentStore.stopLoading();
      }
    },
  },
};
</script>
