<template>
  <section class="w-full min-h-screen h-fit flex flex-col">
    <!-- header -->
    <div
      class="w-full flex items-center justify-between px-[24px] py-[20px] border-b-[1px] border-b-[#e4e4e7]"
    >
      <h1 class="text-[16px] font-extrabold uppercase leading-[150%]">Products</h1>
      <!-- Mobile Nav Hamburger toggle -->
      <div @click="contentStore.handleShowNav()" class="block lg:hidden w-[28px] h-[22px]">
        <img src="../../../assets/svgs/navbar/hamburger-menu.svg" alt="nav-menu-icon" />
      </div>
    </div>

    <!-- Form Section -->
    <div class="w-full flex flex-col gap-[24px] p-[24px] pb-[120px]">
      <div class="w-full flex items-center justify-between">
        <h2 class="text-[16px] font-semibold leading-[150%]">Edit Product</h2>
        <!-- Go Back -->
        <button @click="$router.go(-1)" class="btn-prim px-[16px] py-[8px]">Go Back</button>
      </div>

      <!-- Input fields -->
      <div class="w-full flex flex-col gap-[32px]">
        <!-- Product Details -->
        <div class="w-full flex flex-col gap-[16px]">
          <!-- Header -->
          <h3 class="text-[14px] font-semibold leading-[150%]">Product Details</h3>

          <!-- Inputs -->
          <div class="w-full flex flex-col gap-[40px]">
            <!-- First Row -->
            <div class="w-full flex flex-col md:flex-row gap-[24px]">
              <!-- Product Name -->
              <div class="flex flex-col gap-[8px] w-full">
                <label class="font-semibold text-[14px] leading-[100%]" for="productName"
                  >1. Product Name</label
                >
                <input
                  class="input"
                  type="text"
                  id="productName"
                  name="productName"
                  v-model="productName"
                  placeholder="e.g TGR Suit #001"
                  required
                  autocomplete="off"
                />
              </div>

              <!-- Product Price -->
              <div class="flex flex-col gap-[8px] w-full">
                <label class="font-semibold text-[14px] leading-[100%]" for="productPrice"
                  >2. Product Price</label
                >
                <input
                  class="input"
                  type="number"
                  id="productPrice"
                  name="productPrice"
                  v-model="productPrice"
                  placeholder="e.g 100"
                  required
                  autocomplete="off"
                />
              </div>
            </div>

            <!-- Second Row -->
            <div class="w-full flex flex-col md:flex-row gap-[24px]">
              <!-- Product Type -->
              <div class="flex flex-col gap-[8px] w-full">
                <label class="font-semibold text-[14px] leading-[100%]" for="productType"
                  >3. Product Type</label
                >
                <!-- Input -->
                <div class="relative w-full">
                  <select
                    id="productType"
                    v-model="productType"
                    class="input w-full appearance-none"
                  >
                    <option disabled value="">Select an option</option>
                    <option value="Suit">Suit</option>
                    <option value="Shoe">Shoe</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Tie">Tie</option>
                  </select>

                  <!-- Chevron -->
                  <div
                    class="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <img src="../../../assets/svgs/chevron-down.svg" alt="chevron-icon" />
                  </div>
                </div>
              </div>

              <!-- Sizes -->
              <div class="w-full" ref="sizesDropdown">
                <!-- Suit Sizes -->
                <div v-if="productType === 'Suit'" class="flex flex-col gap-[8px] w-full relative">
                  <label class="font-semibold text-[14px] leading-[100%]" for="productSizes"
                    >4. Suit Sizes</label
                  >

                  <!-- Dropdown button -->
                  <div
                    @click="open = !open"
                    class="input w-full flex justify-between items-center cursor-pointer select-none"
                  >
                    <span>
                      {{
                        selectedSuitSizes.length > 0 ? selectedSuitSizes.join(', ') : 'Select sizes'
                      }}
                    </span>
                    <img src="../../../assets/svgs/chevron-down.svg" alt="chevron-icon" />
                  </div>

                  <!-- Dropdown list -->
                  <div
                    v-if="open"
                    class="absolute top-full left-0 mt-2 w-full bg-white input z-10 !p-[12px] max-h-[200px] overflow-y-auto"
                  >
                    <label
                      v-for="size in availableSuitSizes"
                      :key="size"
                      class="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded-lg px-2"
                    >
                      <input
                        type="checkbox"
                        :value="size"
                        v-model="selectedSuitSizes"
                        class="accent-black"
                      />
                      <span>{{ size }}</span>
                    </label>
                  </div>
                </div>

                <!-- Shoe Sizes -->
                <div v-if="productType === 'Shoe'" class="flex flex-col gap-[8px] w-full relative">
                  <label class="font-semibold text-[14px] leading-[100%]" for="productSizes"
                    >4. Shoe Sizes</label
                  >

                  <!-- Dropdown button -->
                  <div
                    @click="open = !open"
                    class="input w-full flex justify-between items-center cursor-pointer select-none"
                  >
                    <span>
                      {{
                        selectedShoeSizes.length > 0 ? selectedShoeSizes.join(', ') : 'Select sizes'
                      }}
                    </span>
                    <img src="../../../assets/svgs/chevron-down.svg" alt="chevron-icon" />
                  </div>

                  <!-- Dropdown list -->
                  <div
                    v-if="open"
                    class="absolute top-full left-0 mt-2 w-full bg-white input z-10 !p-[12px] max-h-[200px] overflow-y-auto"
                  >
                    <label
                      v-for="size in availableShoeSizes"
                      :key="size"
                      class="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded-lg px-2"
                    >
                      <input
                        type="checkbox"
                        :value="size"
                        v-model="selectedShoeSizes"
                        class="accent-black"
                      />
                      <span>{{ size }}</span>
                    </label>
                  </div>
                </div>

                <!-- Shirt Sizes -->
                <div v-if="productType === 'Shirt'" class="flex flex-col gap-[8px] w-full relative">
                  <label class="font-semibold text-[14px] leading-[100%]" for="productSizes"
                    >4. Shirt Sizes</label
                  >

                  <!-- Dropdown button -->
                  <div
                    @click="open = !open"
                    class="input w-full flex justify-between items-center cursor-pointer select-none"
                  >
                    <span>
                      {{
                        selectedShirtSizes.length > 0
                          ? selectedShirtSizes.join(', ')
                          : 'Select sizes'
                      }}
                    </span>
                    <img src="../../../assets/svgs/chevron-down.svg" alt="chevron-icon" />
                  </div>

                  <!-- Dropdown list -->
                  <div
                    v-if="open"
                    class="absolute top-full left-0 mt-2 w-full bg-white input z-10 !p-[12px] max-h-[200px] overflow-y-auto"
                  >
                    <label
                      v-for="size in availableShirtSizes"
                      :key="size"
                      class="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded-lg px-2"
                    >
                      <input
                        type="checkbox"
                        :value="size"
                        v-model="selectedShirtSizes"
                        class="accent-black"
                      />
                      <span>{{ size }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Supplier Selection -->
            <div class="flex flex-col gap-[8px] w-full">
              <label class="font-semibold text-[14px] leading-[100%]" for="supplier"
                >5. Supplier</label
              >
              <!-- Input -->
              <div class="relative w-full">
                <select id="supplier" v-model="supplier" class="input w-full appearance-none">
                  <option disabled value="">Select the supplier for this product</option>
                  <option value="ctrends">Shoes - CTrends - Ben - +233 24 022 0515</option>
                  <option value="lovejmen">Shoes - Love J Men</option>
                  <option value="superfashion">
                    Suits - Super Fashion - Eben - +233 24 640 2940 - Kanta
                  </option>
                  <option value="luxsuits">
                    Suits - Lux Suits - Eric - +233 53 189 7437 - Tudu
                  </option>
                  <option value="princekanta">
                    Suits - Prince Kanta - Prince - +233 55 380 0986 - Kanta
                  </option>
                  <option value="ericchrisventures">
                    Suits - Eric Chris Ventures - Desmond - +233 59 896 7491 - Tudu
                  </option>
                  <option value="samlizzenterprise">
                    Suits - Sam Lizz Enterprise - Elder Samuel - +233 24 490 8375 - Kanta
                  </option>
                  <option value="luxsuits">
                    Suits - Lux Suits - Eric - +233 53 189 7437 - Tudu
                  </option>
                </select>

                <!-- Chevron -->
                <div
                  class="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <img src="../../../assets/svgs/chevron-down.svg" alt="chevron-icon" />
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-[8px] w-full">
              <label class="font-semibold text-[14px] leading-[100%]" for="productDescription"
                >6. Description</label
              >
              <textarea
                rows="4"
                name="productDescription"
                id="productDescription"
                placeholder="e.g Enter description here"
                v-model="productDescription"
                autocomplete="off"
                required
                class="input"
              ></textarea>
              <p class="text-[12px] opacity-50 font-normal">
                Provide a brief description of the product. Keep it short.
              </p>
            </div>
          </div>
        </div>

        <!-- Recommended Products-->
        <div v-if="productType === 'Suit'" class="w-full flex flex-col gap-[16px]">
          <!-- Header -->
          <h3 class="text-[14px] font-semibold leading-[150%]">Recommended Products</h3>
          <Recommendation
            ref="recommendationRef"
            :initial-recommendations="recommendations"
            @recommendations-updated="updateRecommendations"
            @recommendation-toggled="handleRecommendationToggled"
          />
        </div>

        <!-- Product Photos -->
        <div class="w-full flex flex-col gap-[16px]">
          <!-- Header -->
          <h3 class="text-[14px] font-semibold leading-[150%]">Product Photos</h3>

          <!-- Inputs -->
          <div class="w-full flex flex-col gap-[16px]">
            <!-- Upload Photos Input -->
            <div class="flex flex-col gap-[8px] w-full">
              <label class="font-semibold text-[14px] leading-[100%]" for="productPhotos"
                >7. Click to Upload Photos</label
              >
              <input
                class="input"
                type="file"
                id="productPhotos"
                name="productPhotos"
                ref="productPhotos"
                @change="handlePhotosUpload"
                accept=".png, .jpg, .jpeg, .webp"
                multiple
              />
              <p class="text-[12px] opacity-50 font-normal">
                Please upload up to 4 images. Each should be less than 500kb. After uploading,
                you'll be able to add details to each image. Make sure you fill in details for each
                image.
              </p>
            </div>

            <!-- Hidden Replace Photos Input -->
            <div class="hidden">
              <div class="flex flex-col gap-[8px] w-full">
                <label class="font-semibold text-[14px] leading-[100%]" for="replacePhoto"
                  >Replace Photo</label
                >
                <input
                  class="input"
                  type="file"
                  id="replacePhoto"
                  name="replacePhoto"
                  ref="replacePhoto"
                  @change="handleReplacePhotoUpload"
                  accept=".png, .jpg, .jpeg, .webp"
                />
              </div>
            </div>

            <!-- Photo Preview Section -->
            <div v-if="photos.length" class="w-full flex flex-row gap-[24px] flex-wrap">
              <!-- Photo Details Card -->
              <div
                v-for="(photo, index) in photos"
                :key="index"
                class="w-full md:w-[31%] xl:w-[23%] 2xl:w-[23.5%] flex flex-col gap-[16px]"
              >
                <!-- Photo -->
                <div class="w-full h-[280px]">
                  <img :src="photo.photoUrl" class="size-full object-cover rounded" />
                </div>

                <div class="w-full flex gap-[16px]">
                  <!-- Title Input -->
                  <div class="w-full flex flex-col gap-[8px]">
                    <input
                      type="text"
                      v-model="photo.title"
                      placeholder="e.g Photo 1"
                      class="input"
                    />
                  </div>

                  <!-- Actions Container -->
                  <div class="size-[16px] relative">
                    <!-- Actions Toggle -->
                    <div @click="handleActions(index)" class="size-[16px]">
                      <img
                        class="size-full object-cover hover:cursor-pointer"
                        src="../../../assets/svgs/vertical-dots.svg"
                        alt="vertical-dots-icon"
                      />
                    </div>
                    <!-- Actions Dropdown -->
                    <div
                      v-show="activeActionsIndex === index"
                      class="w-[215px] flex flex-col absolute top-[180%] right-[30%] bg-white z-50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1), 0_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-[4px] border-[1px] border-[#e4e4e7]"
                    >
                      <!-- Actions Header -->
                      <div
                        class="w-full flex justify-between items-center px-[16px] py-[8px] text-[14.5px] leading-[150%] font-semibold"
                      >
                        <h3>Actions</h3>
                        <div
                          class="size-[16px] hover:opacity-50 hover:cursor-pointer"
                          @click="handleActions(index)"
                        >
                          <img src="../../../assets/svgs/close.svg" alt="close-icon" />
                        </div>
                      </div>
                      <!-- Edit -->
                      <div
                        @click="replacePhoto(index)"
                        class="w-full flex items-center gap-[8px] px-[16px] py-[8px] text-[13px] font-semibold leading-[150%] opacity-50 hover:opacity-100 hover:cursor-pointer border-b-[1px] border-b-[#e4e4e7]"
                      >
                        <div class="size-[16px]">
                          <img src="../../../assets/svgs/edit.svg" alt="edit-icon" />
                        </div>
                        <p>Edit</p>
                      </div>
                      <!-- Delete -->
                      <div
                        @click="deletePhoto(index)"
                        class="w-full flex items-center gap-[8px] px-[16px] py-[8px] text-[13px] font-semibold leading-[150%] opacity-50 hover:opacity-100 hover:cursor-pointer border-b-[1px] border-b-[#e4e4e7]"
                      >
                        <div class="size-[16px]">
                          <img src="../../../assets/svgs/delete.svg" alt="delete-icon" />
                        </div>
                        <p>Delete</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex items-center gap-[16px] self-end">
        <button @click="cancelProductUpload" class="btn-sec px-[16px] py-[8px]">Cancel</button>
        <button @click="updateProduct" class="btn-prim px-[16px] py-[8px]">Update</button>
      </div>
    </div>
  </section>
</template>

<script>
import { useContentStore } from '@/stores/content'
import { useUserStore } from '@/stores/userStore'

import { withTimeout } from '@/utils/withTimeout'

import { db, storage } from '@/firebase/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { serverTimestamp } from 'firebase/firestore'

import Recommendation from '@/components/product/Recommendation.vue'

export default {
  name: 'EditProduct',
  components: {
    Recommendation,
  },
  data() {
    return {
      contentStore: useContentStore(),
      userStore: useUserStore(),

      routeId: null,
      selectedProductId: null,
      matchedProduct: null,
      loading: false,

      open: false, // Controls size dropdown visibility
      selectedSuitSizes: [], // Stores chosen suit sizes
      selectedShoeSizes: [], // Stores chosen shoe sizes
      selectedShirtSizes: [], // Stores chosen shirt sizes

      // Predefined available sizes for each product type
      availableSuitSizes: Array.from({ length: 6 }, (_, i) => 42 + 2 * i),
      availableShoeSizes: Array.from({ length: 10 }, (_, i) => 38 + i),
      availableShirtSizes: ['S', 'M', 'L', 'XL', 'XXL'],

      photos: [], // Product images array (each item = { file, previewUrl, title })
      // UI states for actions (like replace/delete menu)
      activeActionsIndex: null, // Tracks which image’s action dropdown is open
      replaceIndex: null, // Tracks which image is being replaced

      // Product form fields
      productType: 'Suit',
      productName: '',
      productPrice: '',
      supplier: '',
      productDescription: '',

      // Recommended product data (populated when suits are added)
      recommendations: {
        shoes: [],
        shirts: [],
        ties: [],
      },

      currentFirebasePhotos: [], // existing images in Firestore
      deletedFirebasePhotos: [], // list of photo URLs marked for deletion
      replacedFirebasePhotos: [], // old photo URLs that were replaced
    }
  },

  async created() {
    await this.loadProduct(this.$route.params.id)
  },

  mounted() {
    // Optional: close dropdown when clicking outside
    window.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleClickOutside)
    this.photos.forEach((photo) => {
      if (photo.photoUrl && photo.photoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photo.photoUrl)
      }
    })
  },

  methods: {
    async loadProduct(id) {
      this.loading = true
      try {
        if (!this.contentStore.products.length) {
          await this.contentStore.fetchProducts()
        }

        const matchedProduct = this.contentStore.products.find((product) => product.id === id)

        if (matchedProduct) {
          this.matchedProduct = matchedProduct
          this.selectedProductId = matchedProduct.id
          this.productName = matchedProduct.productName
          this.productPrice = matchedProduct.productPrice
          this.productType = matchedProduct.productType
          this.supplier = matchedProduct.productSupplier
          this.recommendations = JSON.parse(
            JSON.stringify(
              matchedProduct.recommendedProducts || {
                shoes: [],
                shirts: [],
                ties: [],
              },
            ),
          )

          this.productDescription = matchedProduct.productDescription

          // Handle sizes
          if (this.productType === 'Suit') {
            this.selectedSuitSizes = matchedProduct.productSizes || []
          } else if (this.productType === 'Shoe') {
            this.selectedShoeSizes = matchedProduct.productSizes || []
          } else if (this.productType === 'Shirt') {
            this.selectedShirtSizes = matchedProduct.productSizes || []
          }

          // Handle photos
          this.photos = [...matchedProduct.productPhotos]
          this.currentFirebasePhotos = [...matchedProduct.productPhotos]

          // Reset these every time we load a new product
          this.deletedFirebasePhotos = []
          this.replacedFirebasePhotos = []
        } else {
          this.contentStore.statusMessage = 'The product was not found.'
          this.contentStore.statusState = 'error'
          this.contentStore.showStatusModal = true
        }
      } catch (error) {
        this.contentStore.statusMessage = 'An error occurred while loading the product.'
        this.contentStore.statusState = 'error'
        this.contentStore.showStatusModal = true
      } finally {
        this.loading = false
      }
    },

    /**
     * Closes sizes dropdown if user clicks outside it
     */
    handleClickOutside(e) {
      const dropdown = this.$refs.sizesDropdown
      if (dropdown && !dropdown.contains(e.target)) {
        this.open = false
      }
    },

    /**
     * Called when a recommendation dropdown is toggled.
     * Just ensures the size dropdown closes to prevent UI overlap.
     */
    handleRecommendationToggled(type) {
      // Whenever a recommendation dropdown is toggled,
      // just close the size dropdown if it’s open
      if (this.open) {
        this.open = false
      }
    },

    /**
     * Receives recommendation data from <Recommendation /> component
     */
    updateRecommendations(data) {
      this.recommendations = data
    },

    /**
     * Calls the child Recommendation component to rebuild suggestions.
     * Usually done after a new product is added.
     */
    refreshRecommendations() {
      if (this.$refs.recommendationRef) {
        this.$refs.recommendationRef.buildAvailableRecommendations()
      }
    },

    // Method to handle actions dropdown
    handleActions(index) {
      // Toggle open/close
      this.activeActionsIndex = this.activeActionsIndex === index ? null : index
      this.contentStore.showOverlay = !this.contentStore.showOverlay
    },

    cancelProductUpload() {
      this.$router.push({ name: 'products' })
    },

    // Method to handle new photo uploads upload
    handlePhotosUpload() {
      const selectedFiles = Array.from(this.$refs.productPhotos.files)

      if (this.photos.length >= 4) {
        this.contentStore.statusMessage = 'Maximum of 4 photos allowed per product.'
        this.contentStore.statusState = 'error'
        this.contentStore.showStatusModal = true
        return
      }

      // Cap at 4 photos
      if (selectedFiles.length + this.photos.length > 4) {
        this.contentStore.statusMessage = 'You can only upload up to 4 photos.'
        this.contentStore.statusState = 'error'
        this.contentStore.showStatusModal = true
        return
      }

      selectedFiles.forEach((file) => {
        if (file.size > 500 * 1024) {
          this.contentStore.statusMessage = `Image ${file.name} exceeds 500KB.`
          this.contentStore.statusState = 'error'
          this.contentStore.showStatusModal = true
          return
        }

        this.photos.push({
          file,
          photoUrl: URL.createObjectURL(file),
          title: '',
          isNew: true,
        })
      })
    },

    // Method to handle photo replacement
    replacePhoto(index) {
      this.replaceIndex = index
      this.$refs.replacePhoto.click()
    },

    handleReplacePhotoUpload() {
      const file = this.$refs.replacePhoto.files[0]
      if (!file) return

      if (file.size > 500 * 1024) {
        this.contentStore.statusMessage = 'Please upload a file smaller than 500kb'
        this.contentStore.statusState = 'error'
        this.contentStore.showStatusModal = true
        this.$refs.replacePhoto.value = null
        return
      }

      const oldPhoto = this.photos[this.replaceIndex]

      // ✅ If old photo exists in Firebase, mark it for deletion
      if (oldPhoto.photoUrl) {
        this.replacedFirebasePhotos.push(oldPhoto.photoUrl)
      }

      // Replace locally
      this.photos[this.replaceIndex] = {
        file,
        photoUrl: URL.createObjectURL(file),
        title: this.photos[this.replaceIndex].title, // keep old title
        isNew: true, // ✅ new upload to be reuploaded
      }

      this.handleActions(this.replaceIndex)
      this.replaceIndex = null
      this.$refs.replacePhoto.value = null
    },

    // Method to handle Photo deletions
    deletePhoto(index) {
      const photo = this.photos[index]

      if (photo.photoUrl) {
        // ✅ photo is stored in Firebase, mark for deletion
        this.deletedFirebasePhotos.push(photo.photoUrl)
      }

      this.photos.splice(index, 1)
      this.handleActions(index)
      return
    },

    async deleteFirebasePhotos(photoUrls) {
      for (const url of photoUrls) {
        try {
          const fileRef = ref(storage, url)
          await withTimeout(deleteObject(fileRef))
        } catch (error) {
          console.warn('Error deleting old photo:', error.message)
        }
      }
    },

    // Method to validate form entries
    validateEntries() {
      // Check if all titles are filled
      const incomplete = this.photos.some((photo) => !photo.title.trim())

      if (
        !this.productName ||
        !this.productPrice ||
        !this.supplier ||
        !this.productDescription ||
        incomplete
      ) {
        return false
      }

      return true
    },

    async updateProduct() {
      this.contentStore.startLoading()

      // Validate form inputs
      if (!this.validateEntries()) {
        this.contentStore.statusMessage =
          'Please ensure all the required fields are correctly filled and try again'
        this.contentStore.statusState = 'error'
        this.contentStore.showStatusModal = true
        this.contentStore.stopLoading()
        return
      }

      // Prevent unnecessary requests
      if (this.matchedProduct) {
        const sameBasicInfo =
          this.productName === this.matchedProduct.productName &&
          this.productPrice === this.matchedProduct.productPrice &&
          this.supplier === this.matchedProduct.productSupplier &&
          this.productDescription === this.matchedProduct.productDescription

        // Compare sizes
        const sameSizes =
          JSON.stringify(this.getCurrentSizes()) ===
          JSON.stringify(this.matchedProduct.productSizes || [])

        // Compare photos
        const samePhotos =
          this.photos.length === this.matchedProduct.productPhotos.length &&
          this.photos.every((p, i) => p.photoUrl === this.matchedProduct.productPhotos[i].photoUrl)

        // Compare recommendations (nested object)
        const sameRecommendations = (() => {
          const current = this.recommendations || {}
          const matched = this.matchedProduct.recommendedProducts || {}

          const sameShoes =
            JSON.stringify((current.shoes || []).sort()) ===
            JSON.stringify((matched.shoes || []).sort())

          const sameShirts =
            JSON.stringify((current.shirts || []).sort()) ===
            JSON.stringify((matched.shirts || []).sort())

          const sameTies =
            JSON.stringify((current.ties || []).sort()) ===
            JSON.stringify((matched.ties || []).sort())

          return sameShoes && sameShirts && sameTies
        })()

        // Final condition
        if (sameBasicInfo && sameSizes && samePhotos && sameRecommendations) {
          this.contentStore.statusMessage =
            'No changes detected to update. Ensure you have made some changes.'
          this.contentStore.statusState = 'error'
          this.contentStore.showStatusModal = true
          this.contentStore.stopLoading()
          return
        }
      }

      try {
        // Prepare Firestore document
        const newProductRef = doc(db, 'products', this.selectedProductId)

        const productPhotos = await Promise.all(
          this.photos.map(async (photo) => {
            // ✅ Upload any new or replaced photos
            if (photo.isNew && photo.file) {
              const storageRef = ref(storage, `ProductImages/${Date.now()}_${photo.file.name}`)
              const snapshot = await withTimeout(uploadBytes(storageRef, photo.file))
              const downloadUrl = await withTimeout(getDownloadURL(snapshot.ref))
              return { photoUrl: downloadUrl, title: photo.title }
            } else {
              // Keep existing photo if not changed
              return { photoUrl: photo.photoUrl, title: photo.title }
            }
          }),
        )

        // ✅ Delete old/replaced photos from Firebase
        await this.deleteFirebasePhotos([
          ...new Set([...this.replacedFirebasePhotos, ...this.deletedFirebasePhotos]),
        ])

        const productData = {
          productName: this.productName,
          productPrice: this.productPrice,
          productType: this.productType,
          productSupplier: this.supplier,
          productDescription: this.productDescription,
          productPhotos: productPhotos,
          updatedAt: serverTimestamp(),
          updatedBy: this.userStore.userFirstName + ' ' + this.userStore.userLastName,
        }

        if (this.productType === 'Suit') {
          productData.productSizes = this.selectedSuitSizes
        } else if (this.productType === 'Shoe') {
          productData.productSizes = this.selectedShoeSizes
        } else if (this.productType === 'Shirt') {
          productData.productSizes = this.selectedShirtSizes
        }

        if (this.productType === 'Suit') {
          productData.recommendedProducts = this.recommendations
        }

        await withTimeout(updateDoc(newProductRef, productData))
        await this.contentStore.fetchProducts()

        this.replacedFirebasePhotos = []
        this.deletedFirebasePhotos = []

        await this.loadProduct(this.selectedProductId) // ✅ refresh state with latest Firestore data

        this.contentStore.statusState = 'success'
        this.contentStore.statusMessage = 'Your product has been updated successfully'
        this.contentStore.showStatusModal = true
      } catch (error) {
        this.contentStore.statusState = 'error'
        this.contentStore.statusMessage =
          'There was a problem updating your product. Please try again.'
        this.contentStore.showStatusModal = true
      } finally {
        this.contentStore.stopLoading()
      }
    },
  },
}
</script>
