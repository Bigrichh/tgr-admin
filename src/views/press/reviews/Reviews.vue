<template>
  <section class="w-full min-h-screen h-fit flex flex-col pb-[240px]">
    <!-- header -->
    <div
      class="w-full flex items-center justify-between px-[24px] py-[20px] border-b-[1px] border-b-[#e4e4e7]"
    >
      <h1 class="text-[16px] font-extrabold uppercase leading-[150%]">Reviews</h1>
      <!-- Mobile Nav Hamburger toggle -->
      <div
        @click="contentStore.handleShowNav()"
        class="block lg:hidden w-[28px] h-[22px]"
      >
        <img
          src="../../../assets/svgs/navbar/hamburger-menu.svg"
          alt="nav-menu-icon"
        />
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="w-full p-[24px] flex flex-col lg:flex-row gap-[16px]">
      <!-- Total Reviews card -->
      <div class="stat-card lg:!w-[297px]">
        <div class="w-full">
          <div class="w-full flex items-center justify-between">
            <h2 class="text-[14px] font-semibold leading-[140%]">
              Total Reviews
            </h2>
            <div class="size-[16px]">
              <img
                class="size-full object-cover"
                src="../../../assets/svgs/navbar/reviews.svg"
                alt="reviews-icon"
              />
            </div>
          </div>
          <div class="text-[24px] font-extrabold">
            {{ contentStore.reviews.length }}
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="w-full flex flex-col gap-[24px]">
      <div
        class="w-full flex gap-[16px] flex-col lg:flex-row items-start lg:items-center justify-between px-[24px]"
      >
        <div class="w-full lg:w-fit flex items-center justify-between">
          <h2 class="text-[16px] font-semibold leading-[150%]">Reviews</h2>
          <!-- Add New Review Button - Mobile -->
          <router-link
            class="flex lg:!hidden btn-prim px-[16px] py-[8px]"
            :to="{ name: 'add-new-review' }"
            >Add New Review</router-link
          >
        </div>
        <div class="w-full lg:w-fit flex gap-[8px]">
          <!-- Search -->
          <div class="relative w-full lg:w-[300px]">
            <!-- Icon inside input -->
            <div
              class="size-[14px] absolute left-[12px] md:left-[16px] top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <img
                class="size-full object-cover"
                src="/src/assets/svgs/search.svg"
                alt="search-icon"
              />
            </div>

            <!-- Input -->
            <input
              class="pl-[36px] md:pl-[36px] pr-[12px] py-[8px] w-full border-[1.5px] border-[#e4e4e7] focus:border-[#181818]/100 focus:outline-none placeholder:text-[#181818]/50 text-[14px] leading-[150%] font-medium rounded-[4px]"
              type="text"
              id="search"
              name="search"
              v-model="search"
              placeholder="Search for a review"
              autocomplete="off"
            />
          </div>
          <!-- Add New Review Button - Desktop -->
          <router-link
            class="!hidden lg:!flex btn-prim px-[16px] py-[8px] text-nowrap"
            :to="{ name: 'add-new-review' }"
            >Add New Review</router-link
          >
        </div>
      </div>
      <div
        class="w-screen h-fit lg:w-full overflow-x-scroll lg:overflow-visible px-[24px]"
      >
        <!-- Table Section -->
        <div class="w-full lg:w-full h-fit flex flex-col">
          <!-- Table -->
          <table
            class="!w-[1290px] lg:!w-full !text-nowrap !rounded-[4px] !outline-[1px] !outline-[#e4e4e7]"
          >
            <!-- Header -->
            <thead
              class="!bg-[#f4f4f5] !text-nowrap !font-medium text-[14px] leading-[150%] text-left border-b-[1px] border-b-[#e4e4e7]"
            >
              <tr>
                <th class="!px-[16px] !py-[10px] !w-[50px]">No.</th>
                <th class="!px-[16px] !py-[10px]">Reviewer</th>
                <th class="!px-[16px] !py-[10px]">IG Handle</th>
                <th class="!px-[16px] !py-[10px]">Uploaded By</th>
                <th class="!px-[16px] !py-[10px]">Date Uploaded</th>
                <th class="!w-[50px]"></th>
              </tr>
            </thead>

            <tbody>
              <tr
                class="!font-normal text-[14px] leading-[150%] text-left border-b-[1px] border-b-[#e4e4e7]"
                v-for="(review, index) in filteredReviews"
                :key="review.id"
              >
                <td class="!px-[16px] !py-[10px] !w-[50px]">{{ index + 1 }}</td>
                <td class="!px-[16px] !py-[10px]">{{ review.reviewer }}</td>
                <td class="!px-[16px] !py-[10px]">{{ review.igHandle }}</td>
                <td class="!px-[16px] !py-[10px]">
                  {{ review.uploadedBy }}
                </td>
                <td class="!px-[16px] !py-[10px]">
                  {{ formatDate(review.createdAt) }}
                </td>
                <td
                  class="!w-[50px] !flex !items-center !justify-center !relative"
                >
                  <!-- Actions Icon -->
                  <div
                    @click="handleActions(review.id, $event)"
                    class="size-[16px] hover:cursor-pointer"
                  >
                    <img
                      class="size-full object-cover"
                      src="../../../assets/svgs/vertical-dots.svg"
                      alt="vertical-dots-icon"
                    />
                  </div>
                  <!-- Actions Dropdown -->
                  <Teleport to="body">
                    <div
                      v-show="activeActionsId === review.id"
                      :style="{
                        top: dropdownPos.top + 'px',
                        left: dropdownPos.left + 'px',
                      }"
                      class="w-[215px] flex flex-col fixed bg-white z-50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1), 0_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-[4px] border-[1px] border-[#e4e4e7]"
                    >
                      <!-- Actions Header -->
                      <div
                        class="w-full flex justify-between items-center px-[16px] py-[8px] text-[14.5px] leading-[150%] font-semibold"
                      >
                        <h3>Actions</h3>
                        <div
                          class="size-[16px] hover:opacity-50 hover:cursor-pointer"
                          @click="handleActions(review.id)"
                        >
                          <img
                            src="../../../assets/svgs/close.svg"
                            alt="close-icon"
                          />
                        </div>
                      </div>
                      <!-- Edit -->
                      <div
                        @click="editReview(review.id)"
                        class="w-full flex items-center gap-[8px] px-[16px] py-[8px] text-[13px] font-semibold leading-[150%] opacity-50 hover:opacity-100 hover:cursor-pointer border-b-[1px] border-b-[#e4e4e7]"
                      >
                        <div class="size-[16px]">
                          <img
                            src="../../../assets/svgs/edit.svg"
                            alt="edit-icon"
                          />
                        </div>
                        <p>Edit</p>
                      </div>
                      <!-- Delete -->
                      <div
                        @click="deleteReview(review.id, review.reviewerPhotoUrl)"
                        class="w-full flex items-center gap-[8px] px-[16px] py-[8px] text-[13px] font-semibold leading-[150%] opacity-50 hover:opacity-100 hover:cursor-pointer border-b-[1px] border-b-[#e4e4e7]"
                      >
                        <div class="size-[16px]">
                          <img
                            src="../../../assets/svgs/delete.svg"
                            alt="delete-icon"
                          />
                        </div>
                        <p>Delete</p>
                      </div>
                    </div>
                  </Teleport>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- No reviews / Loading state -->
          <div class="!w-full text-[14px] leading-[150%] text-center">
            <div
              v-if="!contentStore.reviewsLoaded"
              class="w-full !px-[16px] !py-[10px]"
            >
              <!-- skeleton loader is nicer, but for now: -->
              Loading reviews...
            </div>

            <div
              v-else-if="filteredReviews.length === 0"
              class="w-full !px-[16px] !py-[10px]"
            >
              No reviews available.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useContentStore } from "@/stores/content";
import { useUserStore } from "@/stores/userStore";

import { setupDropdownPositioning } from "@/utils/dropdownPositioning";

export default {
  name: "Reviews",
  data() {
    return {
      contentStore: useContentStore(),
      userStore: useUserStore(),
      search: "",
      activeActionsId: null, // which row's dropdown is open
      dropdownPos: { top: 0, left: 0 }, // CSS coordinates for dropdown
      _anchorTd: null, // remembers which <td> we clicked
    };
  },

  computed: {
    filteredReviews() {
      if (!this.search) return this.contentStore.reviews;
      return this.contentStore.reviews.filter(
        (review) =>
          review.reviewer.toLowerCase().includes(this.search.toLowerCase()) ||
          review.igHandle.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },

  mounted() {
    // If the user resizes the window, recalc dropdown.
    window.addEventListener("resize", this.recalcDropdown);
  },

  beforeUnmount() {
    // Clean up event listeners so they don’t hang around.
    window.removeEventListener("resize", this.recalcDropdown);
  },

  methods: {
    // Method to format date
    formatDate(date) {
      if (!date) return "-";
      const d = date.toDate ? date.toDate() : new Date(date); // handle Firestore Timestamp
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },

    // Method to handle actions dropdown
    handleActions(reviewId, event) {
      // Toggle open/close
      this.activeActionsId = this.activeActionsId === reviewId ? null : reviewId;
      this.contentStore.showOverlay = !this.contentStore.showOverlay;

      if (this.activeActionsId !== null) {
        // If opening -> setup positioning
        setupDropdownPositioning(
          event,
          (pos) => (this.dropdownPos = pos),
          (td) => (this._anchorTd = td)
        );
      } else {
        // If closing -> clear anchor
        this._anchorTd = null;
      }
    },

    // Method to recalculate the dropdown’s position when we resize the screen so it stays next to the same <td>.
    recalcDropdown() {
      // If no dropdown is open, or no anchor td saved, do nothing
      if (!this.activeActionsId || !this._anchorTd) return;

      // Just re-run positioning using the cached td
      setupDropdownPositioning(
        this._anchorTd,
        (pos) => (this.dropdownPos = pos),
        (td) => (this._anchorTd = td)
      );
    },

    // Method to handle review deletion
    deleteReview(reviewId, reviewerPhotoUrl) {
      this.handleActions(reviewId);
      this.contentStore.confirmationCallback = () =>
        this.contentStore.deleteReview(reviewId,reviewerPhotoUrl);
      this.contentStore.showConfirmationModal = true;
      this.contentStore.confirmationHeader = "Confirm Deletion";
      this.contentStore.confirmationMessage =
        "Are you sure you want to delete this review?";
      this.contentStore.confirmationActionText = "Delete";
    },

    // Method to handle review editing
    editReview(reviewId) {
      this.handleActions(reviewId);
      this.$router.push({ name: "edit-review", params: { id: reviewId } });
    },
  },
};
</script>
