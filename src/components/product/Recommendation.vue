<template>
  <!-- The main container for all recommendation dropdowns -->
  <div class="w-full h-fit flex flex-col gap-[32px]" data-dropdown="recommendations">
    <!-- Recommended Shoes Section -->
    <div class="flex flex-col gap-[8px] w-full">
      <!-- Label shown above the dropdown -->
      <label class="font-semibold text-[14px] leading-[100%]">7. Recommended Shoes (max 2) </label>

      <!-- Dropdown Container -->
      <div class="relative w-full">
        <!-- When clicked, this opens or closes the dropdown -->
        <div
          @click.stop="toggleDropdown('shoes')"
          class="input w-full flex justify-between items-center cursor-pointer select-none"
        >
          <!-- Shows either the selected shoe names or a placeholder text -->
          <span>
            {{
              recommendedShoes.length
                ? recommendedShoes.map((id) => findNameById(availableShoes, id)).join(', ')
                : 'Select up to 2 shoes'
            }}
          </span>
          <!-- Small downward arrow icon -->
          <img src="../../assets/svgs/chevron-down.svg" alt="chevron" class="w-4 h-4" />
        </div>

        <!-- Dropdown menu (only visible when recOpen.shoes = true) -->
        <!-- @click.stop Prevents dropdown from closing when clicked inside -->
        <div
          v-if="recOpen.shoes"
          @click.stop
          class="absolute top-full left-0 mt-2 w-full bg-white input z-10 p-3 max-h-[400px] overflow-y-auto"
        >
          <!-- Search bar to filter the available shoes -->
          <input
            v-model="search.shoes"
            type="text"
            placeholder="Search shoes..."
            class="w-full input"
          />

          <!-- Filtered List for search -->
          <!-- Loops through each shoe and displays it as an option -->
          <label
            v-for="shoe in filteredShoes"
            :key="shoe.id"
            class="flex shoes-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2"
          >
            <!-- Checkbox for selecting or deselecting this shoe -->
            <input
              type="checkbox"
              :value="shoe.id"
              :checked="recommendedShoes.includes(shoe.id)"
              @change="toggleRecommendation('shoes', shoe.id)"
              class="accent-black"
            />

            <!-- Thumbnail image of shoe with zoom -->
            <div
              v-if="shoe.thumbnail"
              class="relative size-[50px] group"
              @mouseenter="hoveredImage = shoe.thumbnail"
              @mouseleave="hoveredImage = null"
            >
              <img
                :src="shoe.thumbnail"
                alt="Product thumbnail"
                class="w-full h-full object-cover rounded-[4px] border"
              />

              <!-- Big zoom preview of the image when hovered -->
              <div
                v-if="hoveredImage === shoe.thumbnail"
                class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-white border rounded-[8px] shadow-lg z-20 overflow-hidden"
              >
                <img :src="hoveredImage" alt="Zoomed preview" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Shoe name -->
            <div class="flex flex-col">
              <span class="text-[14px] font-medium leading-[100%]">{{ shoe.name }}</span>
            </div>
          </label>

          <!-- Small text at the bottom explaining the 2-item limit -->
          <p class="text-xs opacity-50 mt-2">
            Choose up to 2. Selected items appear in order of selection.
          </p>
        </div>
      </div>
    </div>

    <!-- Recommended Shirts Section -->
    <div class="flex flex-col gap-[8px] w-full">
      <!-- Label shown above the dropdown -->
      <label class="font-semibold text-[14px] leading-[100%]">8. Recommended Shirts (max 2) </label>

      <!-- Dropdown Container -->
      <div class="relative w-full">
        <!-- When clicked, this opens or closes the dropdown -->
        <div
          @click.stop="toggleDropdown('shirts')"
          class="input w-full flex justify-between items-center cursor-pointer select-none"
        >
          <!-- Shows either the selected shirt names or a placeholder text -->
          <span>
            {{
              recommendedShirts.length
                ? recommendedShirts.map((id) => findNameById(availableShirts, id)).join(', ')
                : 'Select up to 2 shirts'
            }}
          </span>
          <!-- Small downward arrow icon -->
          <img src="../../assets/svgs/chevron-down.svg" alt="chevron" class="w-4 h-4" />
        </div>

        <!-- Dropdown menu (only visible when recOpen.shoes = true) -->
        <!-- @click.stop Prevents dropdown from closing when clicked inside -->
        <div
          v-if="recOpen.shirts"
          @click.stop
          class="absolute top-full left-0 mt-2 w-full bg-white input z-10 p-3 max-h-[400px] overflow-y-auto"
        >
          <!-- Search bar to filter the available shirts -->
          <input
            v-model="search.shirts"
            type="text"
            placeholder="Search shirts..."
            class="w-full input"
          />

          <!-- Filtered List for search -->
          <!-- Loops through each shirt and displays it as an option -->
          <label
            v-for="shirt in filteredShirts"
            :key="shirt.id"
            class="flex shirts-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2"
          >
            <!-- Checkbox for selecting or deselecting this shirt -->
            <input
              type="checkbox"
              :value="shirt.id"
              :checked="recommendedShirts.includes(shirt.id)"
              @change="toggleRecommendation('shirts', shirt.id)"
              class="accent-black"
            />

            <!-- Thumbnail image of shirt with zoom -->
            <div
              v-if="shirt.thumbnail"
              class="relative size-[50px] group"
              @mouseenter="hoveredImage = shirt.thumbnail"
              @mouseleave="hoveredImage = null"
            >
              <img
                :src="shirt.thumbnail"
                alt="Product thumbnail"
                class="w-full h-full object-cover rounded-[4px] border"
              />

              <!-- Big zoom preview of the image when hovered -->
              <div
                v-if="hoveredImage === shirt.thumbnail"
                class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-white border rounded-[8px] shadow-lg z-20 overflow-hidden"
              >
                <img :src="hoveredImage" alt="Zoomed preview" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Shirt name -->
            <div class="flex flex-col">
              <span class="text-[14px] font-medium leading-[100%]">{{ shirt.name }}</span>
            </div>
          </label>

          <!-- Small text at the bottom explaining the 2-item limit -->
          <p class="text-xs opacity-50 mt-2">
            Choose up to 2. Selected items appear in order of selection.
          </p>
        </div>
      </div>
    </div>

    <!-- Recommended Ties Section -->
    <div class="flex flex-col gap-[8px] w-full">
      <!-- Label shown above the dropdown -->
      <label class="font-semibold text-[14px] leading-[100%]">9. Recommended Ties (max 2) </label>

      <!-- Dropdown Container -->
      <div class="relative w-full">
        <!-- When clicked, this opens or closes the dropdown -->
        <div
          @click.stop="toggleDropdown('ties')"
          class="input w-full flex justify-between items-center cursor-pointer select-none"
        >
          <!-- Shows either the selected tie names or a placeholder text -->
          <span>
            {{
              recommendedTies.length
                ? recommendedTies.map((id) => findNameById(availableTies, id)).join(', ')
                : 'Select up to 2 ties'
            }}
          </span>
          <!-- Small downward arrow icon -->
          <img src="../../assets/svgs/chevron-down.svg" alt="chevron" class="w-4 h-4" />
        </div>

        <!-- Dropdown menu (only visible when recOpen.shoes = true) -->
        <!-- @click.stop Prevents dropdown from closing when clicked inside -->
        <div
          v-if="recOpen.ties"
          @click.stop
          class="absolute top-full left-0 mt-2 w-full bg-white input z-10 p-3 max-h-[400px] overflow-y-auto"
        >
          <!-- Search bar to filter the available ties -->
          <input
            v-model="search.ties"
            type="text"
            placeholder="Search ties..."
            class="w-full input"
          />

          <!-- Filtered List for search -->
          <!-- Loops through each tie and displays it as an option -->
          <label
            v-for="tie in filteredTies"
            :key="tie.id"
            class="flex shirts-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2"
          >
            <!-- Checkbox for selecting or deselecting this tie -->
            <input
              type="checkbox"
              :value="tie.id"
              :checked="recommendedTies.includes(tie.id)"
              @change="toggleRecommendation('ties', tie.id)"
              class="accent-black"
            />

            <!-- Thumbnail image of tie with zoom -->
            <div
              v-if="tie.thumbnail"
              class="relative size-[50px] group"
              @mouseenter="hoveredImage = tie.thumbnail"
              @mouseleave="hoveredImage = null"
            >
              <img
                :src="tie.thumbnail"
                alt="Product thumbnail"
                class="w-full h-full object-cover rounded-[4px] border"
              />

              <!-- Big zoom preview of the image when hovered -->
              <div
                v-if="hoveredImage === tie.thumbnail"
                class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-white border rounded-[8px] shadow-lg z-20 overflow-hidden"
              >
                <img :src="hoveredImage" alt="Zoomed preview" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Tie name -->
            <div class="flex flex-col">
              <span class="text-[14px] font-medium leading-[100%]">{{ tie.name }}</span>
            </div>
          </label>

          <!-- Small text at the bottom explaining the 2-item limit -->
          <p class="text-xs opacity-50 mt-2">
            Choose up to 2. Selected items appear in order of selection.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useContentStore } from '@/stores/content'
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'Recommendation',
  props: {
    initialRecommendations: {
      type: Object,
      default: () => ({ shoes: [], shirts: [], ties: [] }),
    },
  },

  data() {
    return {
      contentStore: useContentStore(),
      userStore: useUserStore(),

      hoveredImage: null, // Used to track which image is being hovered for zoom view

      // Arrays to store selected recommendation product IDs
      recommendedShoes: this.initialRecommendations.shoes || [],
      recommendedShirts: this.initialRecommendations.shirts || [],
      recommendedTies: this.initialRecommendations.ties || [],

      // Lists of available products to choose from
      availableShoes: [],
      availableShirts: [],
      availableTies: [],

      // Keeps track of which dropdown is currently open or closed
      recOpen: {
        shoes: false,
        shirts: false,
        ties: false,
      },

      // Search inputs for filtering dropdown lists
      search: {
        shoes: '',
        shirts: '',
        ties: '',
      },
    }
  },

  watch: {
    initialRecommendations: {
      handler(newVal) {
        const r = newVal || { shoes: [], shirts: [], ties: [] }
        this.recommendedShoes = Array.isArray(r.shoes) ? [...r.shoes] : []
        this.recommendedShirts = Array.isArray(r.shirts) ? [...r.shirts] : []
        this.recommendedTies = Array.isArray(r.ties) ? [...r.ties] : []
      },
      deep: true,
      immediate: true,
    },

    'contentStore.products': {
      handler() {
        this.buildAvailableRecommendations()
      },
      deep: true,
    },
  },

  mounted() {
    this.buildAvailableRecommendations()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },

  /*
    Computed properties are like live calculators — they automatically re-run
     when the data they depend on changes.
*/
  computed: {
    // Filter available shoes based on what the user types in the search bar
    filteredShoes() {
      return this.availableShoes.filter((item) =>
        item.name.toLowerCase().includes(this.search.shoes.toLowerCase()),
      )
    },
    // Same for shirts
    filteredShirts() {
      return this.availableShirts.filter((item) =>
        item.name.toLowerCase().includes(this.search.shirts.toLowerCase()),
      )
    },
    // Same for ties
    filteredTies() {
      return this.availableTies.filter((item) =>
        item.name.toLowerCase().includes(this.search.ties.toLowerCase()),
      )
    },
  },

  methods: {
    // Toggles a dropdown open/close when the user clicks its header
    toggleDropdown(type) {
      // loop through all dropdown types
      for (const key in this.recOpen) {
        // close every dropdown that isn't the one we clicked
        if (key !== type) {
          this.recOpen[key] = false
        }
      }

      // then toggle the one we actually clicked
      this.recOpen[type] = !this.recOpen[type]

      // tell parent that a dropdown was toggled (in case parent needs to react)
      this.$emit('recommendation-toggled', type)
    },

    // Closes all dropdowns if the user clicks outside of them
    handleClickOutside(e) {
      const dropdowns = document.querySelectorAll('.rec-dropdown')
      let clickedInside = false

      // Check if the click happened inside any dropdown
      dropdowns.forEach((dropdown) => {
        if (dropdown.contains(e.target)) clickedInside = true
      })

      // If the click was outside, close all dropdowns
      if (!clickedInside) {
        this.recOpen.shoes = false
        this.recOpen.shirts = false
        this.recOpen.ties = false
      }
    },

    // Builds a list of available products grouped by type (Shoes, Shirts, Ties)
    buildAvailableRecommendations() {
      const products = this.contentStore.products || []

      this.availableShoes = products
        .filter((product) => product.productType === 'Shoe')
        .map((product) => ({
          id: product.id,
          name: product.productName,
          thumbnail: product.productPhotos?.[0]?.photoUrl || '',
        }))

      this.availableShirts = products
        .filter((product) => product.productType === 'Shirt')
        .map((product) => ({
          id: product.id,
          name: product.productName,
          thumbnail: product.productPhotos?.[0]?.photoUrl || '',
        }))

      this.availableTies = products
        .filter((product) => product.productType === 'Tie')
        .map((product) => ({
          id: product.id,
          name: product.productName,
          thumbnail: product.productPhotos?.[0]?.photoUrl || '',
        }))
    },

    // Finds readable name, with better fallbacks while product catalog loads
    findNameById(list, id) {
      const item = list.find((i) => i.id === id)
      if (item && item.name) return item.name

      // If available lists are empty we assume products are still loading
      const listsExist =
        (this.availableShoes && this.availableShoes.length) ||
        (this.availableShirts && this.availableShirts.length) ||
        (this.availableTies && this.availableTies.length)

      return listsExist ? id : 'Loading...'
    },

    /*
          Toggles a product’s selection when its checkbox is clicked.

          - If it’s already selected → remove it.
          - If it’s not selected → add it, but only up to 2 items max.
        */
    toggleRecommendation(type, id) {
      const arrName =
        type === 'shoes'
          ? 'recommendedShoes'
          : type === 'shirts'
            ? 'recommendedShirts'
            : 'recommendedTies'

      const arr = this[arrName]

      // Remove if already selected
      if (arr.includes(id)) {
        this[arrName] = arr.filter((x) => x !== id)
      } else {
        // Limit check
        if (arr.length >= 2) {
          this.contentStore.statusMessage = 'You can only select up to 2 items for this category.'
          this.contentStore.statusState = 'error'
          this.contentStore.showStatusModal = true
          return
        }

        // Add the new one
        this[arrName] = [...arr, id]
      }

      // ✅ Always emit after changes (both add/remove)
      this.$emit('recommendations-updated', {
        shoes: this.recommendedShoes,
        shirts: this.recommendedShirts,
        ties: this.recommendedTies,
      })
    },

    resetRecommendations() {
      this.recommendedShoes = []
      this.recommendedShirts = []
      this.recommendedTies = []

      // emit so parent stays in sync
      this.$emit('recommendations-updated', {
        shoes: [],
        shirts: [],
        ties: [],
      })
    },
  },
}
</script>
