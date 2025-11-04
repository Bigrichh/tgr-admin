<template>
  <div class="w-full h-screen flex items-center justify-center text-[16px] leading-[150%] text-center font-semibold"
    v-if="loading">
    Loading post...
  </div>
  <section v-else class="w-full min-h-screen h-fit flex flex-col">
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
        <button @click="updatePost" class="btn-prim px-[16px] py-[8px]">
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

import { QuillEditor } from "@vueup/vue-quill";
import BlotFormatter from "quill-blot-formatter/dist/BlotFormatter";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

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
  name: "Edit-Post",
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
      routeId: null,
      selectedPostId: null,
      matchedPost: null,
      loading: false,

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
      currentFirebaseImageUrl: null,
    };
  },

  async created() {
    this.loading = true;
    try {
      this.routeId = this.$route.params.id;

      if (!this.contentStore.blogPosts.length) {
        await this.contentStore.fetchBlogPosts();
      }

      const matchedPost = this.contentStore.blogPosts.find(
        (post) => post.id === this.routeId
      );

      if (matchedPost) {
        this.matchedPost = matchedPost;
        this.selectedPostId = matchedPost.id;
        this.title = matchedPost.title;
        this.description = matchedPost.description;
        this.category = matchedPost.category;
        this.postContent = matchedPost.postContent;
        this.postCoverPhotoUrl = matchedPost.postCoverPhotoUrl;
        this.currentFirebaseImageUrl = matchedPost.postCoverPhotoUrl;
      } else {
        this.contentStore.showStatusModal = true;
        this.contentStore.statusMessage = "The post not found.";
        this.contentStore.statusState = "error";
      }
    } catch (error) {
      this.contentStore.showStatusModal = true;
      this.contentStore.statusMessage =
        "An error occurred while loading the post.";
      this.contentStore.statusState = "error";
    } finally {
      this.loading = false;
    }
  },

  methods: {
    // Method to validate form entries
    validateEntries() {
      if (
        !this.title ||
        !this.description ||
        !this.category ||
        !this.postContent
      ) {
        return false;
      }

      return true;
    },

    cancelPost() {
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

    async updatePost() {
      this.contentStore.startLoading();

      // Validate form inputs
      if (!this.validateEntries()) {
        this.contentStore.statusMessage =
          "Please fill in all required fields: Post Title, Description,,Category, and Post Content.";
        this.contentStore.statusState = "error";
        this.contentStore.showStatusModal = true;
        this.contentStore.stopLoading();
        return;
      }

      //Prevent unecessary requests
      if (this.matchedPost) {
        if (
          this.title === this.matchedPost.title &&
          this.description === this.matchedPost.description &&
          this.category === this.matchedPost.category &&
          this.postContent === this.matchedPost.postContent &&
          this.postCoverPhotoUrl === this.matchedPost.postCoverPhotoUrl
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
        let postCoverPhotoUrl = this.postCoverPhotoUrl;
        // Prepare Firestore document
        const newPostRef = doc(db, "blog", this.selectedPostId);

        // Only upload if a new image was selected
        if (this.postCoverPhotoFile) {
          // Delete the old image first if it exists
          if (
            this.selectedPostId &&
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
            `BlogPostImages/${Date.now()}_${this.postCoverPhotoFile.name}`
          );
          const snapshot = await withTimeout(
            uploadBytes(storageRef, this.postCoverPhotoFile)
          );
          postCoverPhotoUrl = await withTimeout(getDownloadURL(snapshot.ref));
        }

        this.currentFirebaseImageUrl = postCoverPhotoUrl;

        const postData = {
          title: this.title,
          description: this.description,
          category: this.category,
          postContent: this.postContent,
          postCoverPhotoUrl: postCoverPhotoUrl,
          updatedAt: serverTimestamp(),
          updatedBy:
            this.userStore.userFirstName + " " + this.userStore.userLastName,
        };

        await withTimeout(updateDoc(newPostRef, postData));
        await this.contentStore.fetchBlogPosts();

        this.contentStore.statusState = "success";
        this.contentStore.statusMessage =
          "Your blog post has been updated successfully";
        this.contentStore.showStatusModal = true;
      } catch (error) {
        this.contentStore.statusState = "error";
        this.contentStore.statusMessage =
          "There was a problem updating your post. Please try again.";
        this.contentStore.showStatusModal = true;
      } finally {
        this.contentStore.stopLoading();
      }
    },
  },
};
</script>
