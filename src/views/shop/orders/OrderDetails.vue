<template>
  <section class="w-full min-h-screen h-fit flex flex-col pb-[240px]">
    <!-- header -->
    <div
      class="w-full flex items-center justify-between px-[24px] py-[20px] border-b-[1px] border-b-[#e4e4e7]"
    >
      <h1 class="text-[16px] font-extrabold uppercase leading-[150%]">Order Details</h1>
      <!-- Mobile Nav Hamburger toggle -->
      <div @click="contentStore.handleShowNav()" class="block lg:hidden w-[28px] h-[22px]">
        <img src="../../../assets/svgs/navbar/hamburger-menu.svg" alt="nav-menu-icon" />
      </div>
    </div>

    <!-- Loading state-->
    <div
      v-if="!contentStore.ordersLoaded"
      class="!w-full h-[80vh] flex items-center justify-center text-[14px] leading-[150%] text-center"
    >
      <div v-if="loading" class="w-full !px-[16px] !py-[10px]">
        <!-- skeleton loader is nicer, but for now: -->
        Loading order...
      </div>
    </div>

    <section v-else class="w-full flex flex-col gap-[40px] py-[24px]">
      <div
        class="w-full flex flex-col md:flex-row items-start md:items-center gap-[16px] md:gap-0 justify-between px-[24px]"
      >
        <h2 class="text-[16px] font-semibold leading-[150%]">
          Order :
          <span class="opacity-50 font-normal">({{ matchedOrder.orderId }})</span>
        </h2>
        <div class="w-full md:w-fit flex gap-[8px]">
          <!-- Update Status -->
          <button @click="handleShowStatus" class="!w-full md:!w-fit btn-prim px-[16px] py-[8px]">
            Update Status
          </button>
          <!-- Status Modal -->
          <div
            v-show="showStatusModal"
            class="w-full px-[32px] md:px-0 md:w-[400px] fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <div
              class="w-full flex flex-col bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1), 0_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-[4px] border-[1px] border-[#e4e4e7]"
            >
              <!-- Status Header -->
              <div
                class="w-full flex justify-between items-center px-[16px] py-[8px] text-[14.5px] leading-[150%] font-semibold border-b-[1px] border-b-[#e4e4e7]"
              >
                <h3>Change Order Status</h3>
                <div
                  class="size-[16px] hover:opacity-50 hover:cursor-pointer"
                  @click="handleShowStatus"
                >
                  <img src="../../../assets/svgs/close.svg" alt="close-icon" />
                </div>
              </div>
              <!-- Status selection input -->
              <div
                class="w-full flex items-center gap-[8px] px-[16px] py-[8px] border-b-[1px] border-b-[#e4e4e7]"
              >
                <!-- Status Selection -->
                <div class="flex flex-col gap-[8px] w-full">
                  <label class="font-semibold text-[14px] leading-[100%]" for="status"
                    >Select Status</label
                  >
                  <!-- Input -->
                  <div class="relative w-full">
                    <select id="status" v-model="status" class="input w-full appearance-none">
                      <option value="pending">pending</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                      <option value="refunded">refunded</option>
                    </select>

                    <!-- Chevron -->
                    <div
                      class="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      <img src="../../../assets/svgs/chevron-down.svg" alt="chevron-icon" />
                    </div>
                  </div>
                </div>
              </div>
              <!-- Submission Button -->
              <div class="w-full flex items-center justify-end px-[16px] py-[8px] gap-[16px]">
                <button @click="handleShowStatus" class="btn-sec px-[16px] py-[8px]">Cancel</button>
                <button @click="updateStatus" class="btn-prim px-[16px] py-[8px]">
                  Update Status
                </button>
              </div>
            </div>
          </div>
          <!-- Go Back -->
          <button @click="$router.go(-1)" class="!w-full md:!w-fit btn-alt px-[16px] py-[8px]">
            Go Back
          </button>
        </div>
      </div>

      <!-- Order Details -->
      <div class="w-full flex flex-col gap-[24px]">
        <div class="w-full px-[24px]">
          <h2 class="text-[16px] font-semibold leading-[150%]">Order Details</h2>
        </div>
        <div class="w-screen h-fit lg:w-full overflow-x-scroll lg:overflow-visible px-[24px]">
          <!-- Table Section -->
          <div class="w-full lg:w-full h-fit flex flex-col">
            <!-- Table -->
            <table class="!w-[1290px] lg:!w-full !rounded-[4px] !outline-[1px] !outline-[#e4e4e7]">
              <!-- Header -->
              <thead
                class="!bg-[#f4f4f5] !font-medium text-[14px] leading-[150%] text-left border-b-[1px] border-b-[#e4e4e7]"
              >
                <tr>
                  <th class="!px-[16px] !py-[10px] !w-[50px]">Order ID</th>
                  <th class="!px-[16px] !py-[10px]">Date Ordered</th>
                  <th class="!px-[16px] !py-[10px]">Total Amount Paid</th>
                  <th class="!w-[140px] !px-[16px] !py-[10px]">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  class="!font-normal text-[14px] leading-[150%] text-left border-b-[1px] border-b-[#e4e4e7]"
                >
                  <td class="!px-[16px] !py-[10px] !w-[50px]">
                    {{ matchedOrder.orderId }}
                  </td>
                  <td class="!px-[16px] !py-[10px]">
                    {{
                      matchedOrder.orderedAt.toDate().toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    }}
                  </td>
                  <td class="!px-[16px] !py-[10px]">GHS {{ matchedOrder.totalCost }}</td>
                  <td class="!px-[16px] !py-[10px]">
                    <div
                      class="w-full flex items-center justify-center text-[12.5px] gap-[5px] border-[2px] px-[8px] py-[3px] rounded-[4px]"
                      :class="[
                        {
                          '!border-[#008000]': matchedOrder.status === 'completed',
                        },
                        {
                          '!border-[#0000FF]': matchedOrder.status === 'refunded',
                        },
                        {
                          '!border-[#E00000]': matchedOrder.status === 'cancelled',
                        },
                        {
                          '!border-[#AAAA00]': matchedOrder.status === 'pending',
                        },
                      ]"
                    >
                      <div class="size-[14px]">
                        <img
                          class="size-full object-cover"
                          :src="getStatusIcon(matchedOrder.status)"
                          alt="status-icon"
                        />
                      </div>
                      <p
                        class="!font-medium"
                        :class="[
                          {
                            '!text-[#008000]': matchedOrder.status === 'completed',
                          },
                          {
                            '!text-[#0000FF]': matchedOrder.status === 'refunded',
                          },
                          {
                            '!text-[#E00000]': matchedOrder.status === 'cancelled',
                          },
                          {
                            '!text-[#AAAA00]': matchedOrder.status === 'pending',
                          },
                        ]"
                      >
                        {{ matchedOrder.status }}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Customer Information -->
      <div class="w-full flex flex-col gap-[24px]">
        <div class="w-full px-[24px]">
          <h2 class="text-[16px] font-semibold leading-[150%]">Customer Information</h2>
        </div>
        <div class="w-screen h-fit lg:w-full overflow-x-scroll lg:overflow-visible px-[24px]">
          <!-- Table Section -->
          <div class="w-full lg:w-full h-fit flex flex-col">
            <!-- Table -->
            <table class="!w-[1290px] lg:!w-full !rounded-[4px] !outline-[1px] !outline-[#e4e4e7]">
              <!-- Header -->
              <thead
                class="!bg-[#f4f4f5] !font-medium text-[14px] leading-[150%] text-left border-b-[1px] border-b-[#e4e4e7]"
              >
                <tr>
                  <th class="!px-[16px] !py-[10px]">Customer Name</th>
                  <th class="!px-[16px] !py-[10px]">Email</th>
                  <th class="!px-[16px] !py-[10px]">Phone Number</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  class="!font-normal text-[14px] leading-[150%] text-left border-b-[1px] border-b-[#e4e4e7]"
                >
                  <td class="!px-[16px] !py-[10px]">
                    {{ matchedOrder.customerName }}
                  </td>
                  <td class="!px-[16px] !py-[10px]">
                    {{ matchedOrder.customerEmail }}
                  </td>
                  <td class="!px-[16px] !py-[10px]">
                    {{ matchedOrder.customerNumber }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Products Ordered-->
      <div class="w-full flex flex-col gap-[24px]">
        <div class="w-full px-[24px]">
          <h2 class="text-[16px] font-semibold leading-[150%]">Products Ordered</h2>
        </div>
        <div class="w-screen h-fit lg:w-full overflow-x-scroll lg:overflow-visible px-[24px]">
          <!-- Table Section -->
          <div class="w-full lg:w-full h-fit flex flex-col">
            <!-- Table -->
            <table class="!w-[1290px] lg:!w-full !rounded-[4px] !outline-[1px] !outline-[#e4e4e7]">
              <!-- Header -->
              <thead
                class="!bg-[#f4f4f5] !font-medium text-[14px] leading-[150%] text-left border-b-[1px] border-b-[#e4e4e7]"
              >
                <tr>
                  <th class="!px-[16px] !py-[10px]">Name</th>
                  <th class="!px-[16px] !py-[10px]">Price</th>
                  <th class="!px-[16px] !py-[10px]">Selected Quantity</th>
                  <th class="!px-[16px] !py-[10px]">Selected Size</th>
                  <th class="!px-[16px] !py-[10px]">Selected Rec Products</th>
                  <th class="!px-[16px] !py-[10px]">Total Amount Paid</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(product, index) in matchedOrder.productsOrdered"
                  class="!font-normal text-[14px] leading-[150%] text-left border-b-[1px] border-b-[#e4e4e7]"
                >
                  <td class="!px-[16px] !py-[10px]">
                    {{ product.productName }}
                  </td>
                  <td class="!px-[16px] !py-[10px]">GHS {{ product.productPrice }}</td>
                  <td class="!px-[16px] !py-[10px]">
                    {{ product.selectedQuantity }}
                  </td>
                  <td class="!px-[16px] !py-[10px]">
                    {{ product.selectedSize }}
                  </td>
                  <td class="!px-[16px] !py-[10px]">
                    {{
                      product?.selectedRecProducts
                        ? formatSelectedRecProducts(product.selectedRecProducts)
                        : '—'
                    }}
                  </td>
                  <td class="!px-[16px] !py-[10px]">GHS {{ product.totalCost }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Customer Delivery Details-->
      <div class="w-full flex flex-col gap-[24px]">
        <div class="w-full px-[24px]">
          <h2 class="text-[16px] font-semibold leading-[150%]">Customer Delivery Details</h2>
        </div>
        <div class="w-screen h-fit lg:w-full overflow-x-scroll lg:overflow-visible px-[24px]">
          <!-- Table Section -->
          <div class="w-full lg:w-full h-fit flex flex-col">
            <!-- Table -->
            <table class="!w-[1290px] lg:!w-full !rounded-[4px] !outline-[1px] !outline-[#e4e4e7]">
              <!-- Header -->
              <thead
                class="!bg-[#f4f4f5] !font-medium text-[14px] leading-[150%] text-left border-b-[1px] border-b-[#e4e4e7]"
              >
                <tr>
                  <th class="!px-[16px] !py-[10px]">Customer Country</th>
                  <th class="!px-[16px] !py-[10px]">Customer Address</th>
                  <th class="!px-[16px] !py-[10px]">Customer Region/State</th>
                  <th class="!px-[16px] !py-[10px]">Customer City/Town</th>
                  <th class="!px-[16px] !py-[10px]">Customer Postal Code</th>
                  <th class="!px-[16px] !py-[10px]">Customer House/Apt No.</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  class="!font-normal text-[14px] leading-[150%] text-left border-b-[1px] border-b-[#e4e4e7]"
                >
                  <td class="!px-[16px] !py-[10px]">
                    {{ matchedOrder.customerCountry }}
                  </td>
                  <td class="!px-[16px] !py-[10px]">
                    {{ matchedOrder.customerStreetAddress }}
                  </td>
                  <td class="!px-[16px] !py-[10px]">
                    {{ matchedOrder.customerRegionState }}
                  </td>
                  <td class="!px-[16px] !py-[10px]">
                    {{ matchedOrder.customerCityTown }}
                  </td>
                  <td class="!px-[16px] !py-[10px]">
                    {{ matchedOrder.customerPostalCode }}
                  </td>
                  <td class="!px-[16px] !py-[10px]">
                    {{ matchedOrder.customerHouseAptOffNumber }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { useContentStore } from '@/stores/content'
import { useUserStore } from '@/stores/userStore'

import { withTimeout } from '@/utils/withTimeout'

import { db } from '@/firebase/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import { serverTimestamp } from 'firebase/firestore'

export default {
  name: 'Order-Details',
  data() {
    return {
      contentStore: useContentStore(),
      userStore: useUserStore(),
      search: '',
      routeId: null,
      loading: false,
      selectedOrderId: null,
      matchedOrder: null,
      status: null,
      oldStatus: null,
      showStatusModal: false,
    }
  },

  async created() {
    this.loading = true
    try {
      this.routeId = this.$route.params.id

      if (!this.contentStore.orders.length) {
        await this.contentStore.fetchOrders()
      }

      const matchedOrder = this.contentStore.orders.find((order) => order.orderId === this.routeId)

      if (matchedOrder) {
        this.matchedOrder = matchedOrder
        this.selectedOrderId = matchedOrder.orderId
        this.status = matchedOrder.status
        this.oldStatus = matchedOrder.status
      } else {
        this.contentStore.showStatusModal = true
        this.contentStore.statusMessage = 'The order was not found.'
        this.contentStore.statusState = 'error'
      }
    } catch (error) {
      this.contentStore.showStatusModal = true
      this.contentStore.statusMessage = 'An error occurred while loading the order.'
      this.contentStore.statusState = 'error'
    } finally {
      this.loading = false
    }
  },

  methods: {
    getStatusIcon(status) {
      switch (status) {
        case 'completed':
          return new URL(`../../../assets/svgs/fulfilled.svg`, import.meta.url).href
        case 'cancelled':
          return new URL(`../../../assets/svgs/cancelled.svg`, import.meta.url).href
        case 'refunded':
          return new URL(`../../../assets/svgs/refunded.svg`, import.meta.url).href
        default:
          return new URL(`../../../assets/svgs/pending.svg`, import.meta.url).href
      }
    },

    formatSelectedRecProducts(selectedRecProducts) {
      try {
        // If it's not a valid object or empty, show placeholder
        if (
          !selectedRecProducts ||
          typeof selectedRecProducts !== 'object' ||
          Object.keys(selectedRecProducts).length === 0
        ) {
          return '—'
        }

        // Flatten all product arrays from the object
        const allRecProducts = Object.values(selectedRecProducts).flat()

        // If still empty after flattening
        if (!Array.isArray(allRecProducts) || allRecProducts.length === 0) {
          return '—'
        }

        // Access your global product list
        const allProducts = this.contentStore?.products || []

        // Map through flattened list
        return allRecProducts
          .map((rec) => {
            if (!rec || typeof rec !== 'object') return '(Unknown)'

            const productId = rec.id || rec // sometimes the item might just be an ID string
            const product = allProducts.find((p) => p.id === productId)
            const name = product?.productName || '(Unknown Product)'
            const size = rec.selectedSize ? ` (${rec.selectedSize})` : ''
            return name + size
          })
          .join(', ')
      } catch (error) {
        console.error('Error in formatSelectedRecProducts:', error)
        return '(Error loading products)'
      }
    },

    handleShowStatus() {
      this.contentStore.showOverlay = !this.contentStore.showOverlay
      this.showStatusModal = !this.showStatusModal
    },

    async updateStatus() {
      this.contentStore.startLoading()
      this.handleShowStatus()

      // Validate form inputs
      if (this.status === this.oldStatus) {
        this.contentStore.statusMessage =
          'The Status has not been changed. Please update to a new status and try again'
        this.contentStore.statusState = 'error'
        this.contentStore.showStatusModal = true
        this.contentStore.stopLoading()
        return
      }

      try {
        let orderUpdate = {
          status: this.status,
          updatedAt: serverTimestamp(),
          updatedBy: this.userStore.userFirstName + ' ' + this.userStore.userLastName,
        }

        // Reference to the Firestore document
        const orderDetailRef = doc(db, 'orders', this.routeId)

        // Attempt to update the document
        await withTimeout(updateDoc(orderDetailRef, orderUpdate))
        // ✅ Update local state immediately so UI reflects instantly
        this.matchedOrder.status = this.status
        this.oldStatus = this.status
        await this.contentStore.fetchOrders()

        this.contentStore.statusState = 'success'
        this.contentStore.statusMessage = 'The Status has been updated successfully'
        this.contentStore.showStatusModal = true
      } catch (error) {
        this.contentStore.statusState = 'error'
        this.contentStore.statusMessage =
          'There was a problem updating the status. Please try again.'
        this.contentStore.showStatusModal = true
      } finally {
        this.contentStore.stopLoading()
      }
    },
  },
}
</script>
