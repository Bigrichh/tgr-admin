<template>
    <section class="w-full min-h-screen h-fit flex flex-col pb-[240px]">
        <!-- header -->
        <div class="w-full flex items-center justify-between px-[24px] py-[20px] border-b-[1px] border-b-[#e4e4e7]">
            <h1 class="text-[16px] font-extrabold uppercase leading-[150%]">
                Orders
            </h1>
            <!-- Mobile Nav Hamburger toggle -->
            <div @click="contentStore.handleShowNav()" class="block lg:hidden w-[28px] h-[22px]">
                <img src="../../assets/svgs/navbar/hamburger-menu.svg" alt="nav-menu-icon" />
            </div>
        </div>

        <!-- Stat Cards -->
        <div class="w-full p-[24px] flex flex-col lg:flex-row gap-[16px]">
            <!-- Total Orders card -->
            <div class="stat-card">
                <div class="w-full">
                    <div class="w-full flex items-center justify-between">
                        <h2 class="text-[14px] font-semibold leading-[140%]">
                            Total Orders
                        </h2>
                        <div class="size-[16px]">
                            <img class="size-full object-cover" src="../../../assets/svgs/navbar/orders.svg"
                                alt="orders-icon" />
                        </div>
                    </div>
                    <div class="text-[24px] font-extrabold">
                        {{ contentStore.orders.length }}
                    </div>
                </div>
            </div>
            <!-- Orders this month Card -->
            <div class="stat-card">
                <div class="w-full">
                    <div class="w-full flex items-center justify-between">
                        <h2 class="text-[14px] font-semibold leading-[140%]">
                            Orders This Month
                        </h2>
                        <div class="size-[16px]">
                            <img class="size-full object-cover" src="../../../assets/svgs/navbar/orders.svg"
                                alt="orders-icon" />
                        </div>
                    </div>
                    <div class="text-[24px] font-extrabold">{{ ordersThisMonth }}</div>
                </div>
            </div>
            <!-- Orders Today -->
            <div class="stat-card">
                <div class="w-full">
                    <div class="w-full flex items-center justify-between">
                        <h2 class="text-[14px] font-semibold leading-[140%]">
                            Orders Today
                        </h2>
                        <div class="size-[16px]">
                            <img class="size-full object-cover" src="../../../assets/svgs/navbar/orders.svg"
                                alt="orders-icon" />
                        </div>
                    </div>
                    <div class="text-[24px] font-extrabold">{{ ordersToday }}</div>
                </div>
            </div>
            <!-- Average Order Value  -->
            <div class="stat-card">
                <div class="w-full">
                    <div class="w-full flex items-center justify-between">
                        <h2 class="text-[14px] font-semibold leading-[140%]">
                            Average Order Value
                        </h2>
                        <div class="size-[16px]">
                            <img class="size-full object-cover" src="../../../assets/svgs/navbar/orders.svg"
                                alt="orders-icon" />
                        </div>
                    </div>
                    <div class="text-[24px] font-extrabold">
                        GHS {{ averageOrderValue }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Table Section -->
        <div class="w-full flex flex-col gap-[24px]">
            <div
                class="w-full flex gap-[16px] flex-col lg:flex-row items-start lg:items-center justify-between px-[24px]">
                <h2 class="text-[16px] font-semibold leading-[150%]">Orders</h2>
                <!-- Search -->
                <div class="relative w-full lg:w-[300px]">
                    <!-- Icon inside input -->
                    <div
                        class="size-[14px] absolute left-[12px] md:left-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
                        <img class="size-full object-cover" src="/src/assets/svgs/search.svg" alt="search-icon" />
                    </div>

                    <!-- Input -->
                    <input
                        class="pl-[36px] md:pl-[36px] pr-[12px] py-[8px] w-full border-[1.5px] border-[#e4e4e7] focus:border-[#181818]/100 focus:outline-none placeholder:text-[#181818]/50 text-[14px] leading-[150%] font-medium rounded-[4px]"
                        type="text" id="search" name="search" v-model="search" placeholder="Search for an order"
                        autocomplete="off" />
                </div>
            </div>

            <div class="w-screen h-fit lg:w-full overflow-x-scroll lg:overflow-visible px-[24px]">
                <!-- Table Section -->
                <div class="w-full lg:w-full h-fit flex flex-col">
                    <!-- Table -->
                    <table class="!w-[1290px] lg:!w-full !rounded-[4px] !outline-[1px] !outline-[#e4e4e7]">
                        <!-- Header -->
                        <thead
                            class="!bg-[#f4f4f5] !font-medium text-[14px] leading-[150%] text-left border-b-[1px] border-b-[#e4e4e7]">
                            <tr>
                                <th class="!px-[16px] !py-[10px] !w-[50px]">No.</th>
                                <th class="!px-[16px] !py-[10px]">Customer Name</th>
                                <th class="!px-[16px] !py-[10px]">Amount Paid</th>
                                <th class="!px-[16px] !py-[10px]">Order Date</th>
                                <th class="!w-[140px] !px-[16px] !py-[10px]">Status</th>
                                <th class="!w-[50px]"></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr class="!font-normal text-[14px] leading-[150%] text-left border-b-[1px] border-b-[#e4e4e7]"
                                v-for="(order, index) in filteredOrders" :key="order.orderId">
                                <td class="!px-[16px] !py-[10px] !w-[50px]">{{ index + 1 }}</td>
                                <td class="!px-[16px] !py-[10px]">{{ order.customerName }}</td>
                                <td class="!px-[16px] !py-[10px]">GHS {{ order.totalCost }}</td>
                                <td class="!px-[16px] !py-[10px]">
                                    {{
                                        order.orderedAt.toDate().toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    })
                                    }}
                                </td>
                                <td class="!px-[16px] !py-[10px]">
                                    <div class="w-full flex items-center justify-center text-[12.5px] gap-[5px] border-[2px] px-[8px] py-[3px] rounded-[4px]"
                                        :class="[
                                            {
                                                '!border-[#008000]': order.status === 'completed',
                                            },
                                            { '!border-[#0000FF]': order.status === 'refunded' },
                                            {
                                                '!border-[#E00000]': order.status === 'cancelled',
                                            },
                                            { '!border-[#AAAA00]': order.status === 'pending' },
                                        ]">
                                        <div class="size-[14px]">
                                            <img class="size-full object-cover" :src="getStatusIcon(order.status)"
                                                alt="status-icon" />
                                        </div>
                                        <p class="!font-medium" :class="[
                                            {
                                                '!text-[#008000]': order.status === 'completed',
                                            },
                                            { '!text-[#0000FF]': order.status === 'refunded' },
                                            {
                                                '!text-[#E00000]': order.status === 'cancelled',
                                            },
                                            { '!text-[#AAAA00]': order.status === 'pending' },
                                        ]">
                                            {{ order.status }}
                                        </p>
                                    </div>
                                </td>

                                <td class="!w-[50px] !flex !items-center !justify-center !relative">
                                    <!-- Actions Icon -->
                                    <div @click="handleActions(order.orderId, $event)"
                                        class="size-[16px] hover:cursor-pointer">
                                        <img class="size-full object-cover" src="../../../assets/svgs/vertical-dots.svg"
                                            alt="vertical-dots-icon" />
                                    </div>
                                    <!-- Actions Dropdown -->
                                    <Teleport to="body">
                                        <div v-show="activeActionsId === order.orderId" :style="{
                                            top: dropdownPos.top + 'px',
                                            left: dropdownPos.left + 'px',
                                        }"
                                            class="w-[215px] flex flex-col fixed bg-white z-50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1), 0_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-[4px] border-[1px] border-[#e4e4e7]">
                                            <!-- Actions Header -->
                                            <div
                                                class="w-full flex justify-between items-center px-[16px] py-[8px] text-[14.5px] leading-[150%] font-semibold">
                                                <h3>Actions</h3>
                                                <div class="size-[16px] hover:opacity-50 hover:cursor-pointer"
                                                    @click="handleActions(order.orderId)">
                                                    <img src="../../../assets/svgs/close.svg" alt="close-icon" />
                                                </div>
                                            </div>
                                            <!-- View Details -->
                                            <div @click="viewDetails(order.orderId)"
                                                class="w-full flex items-center gap-[8px] px-[16px] py-[8px] text-[13px] font-semibold leading-[150%] opacity-50 hover:opacity-100 hover:cursor-pointer border-b-[1px] border-b-[#e4e4e7]">
                                                <div class="size-[16px]">
                                                    <img src="../../../assets/svgs/details.svg" alt="details-icon" />
                                                </div>
                                                <p>View Details</p>
                                            </div>
                                        </div>
                                    </Teleport>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- No posts / Loading state -->
                    <div class="!w-full text-[14px] leading-[150%] text-center">
                        <div v-if="!contentStore.ordersLoaded" class="w-full !px-[16px] !py-[10px]">
                            <!-- skeleton loader is nicer, but for now: -->
                            Loading orders...
                        </div>

                        <div v-else-if="filteredOrders.length === 0" class="w-full !px-[16px] !py-[10px]">
                            No orders available.
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
    name: "Orders",
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
        filteredOrders() {
            if (!this.search) return this.contentStore.orders;
            return this.contentStore.orders.filter(
                (order) =>
                    order.customerName
                        .toLowerCase()
                        .includes(this.search.toLowerCase()) ||
                    order.customerEmail.toLowerCase().includes(this.search.toLowerCase())
            );
        },

        ordersThisMonth() {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            return this.contentStore.orders.filter((order) => {
                const orderDate = order.orderedAt?.toDate
                    ? order.orderedAt.toDate() // Firestore Timestamp
                    : new Date(order.orderedAt); // fallback if it's already a Date or string

                return (
                    orderDate.getMonth() === currentMonth &&
                    orderDate.getFullYear() === currentYear
                );
            }).length;
        },

        ordersToday() {
            const now = new Date();

            return this.contentStore.orders.filter((order) => {
                const orderDate = order.orderedAt?.toDate
                    ? order.orderedAt.toDate()
                    : new Date(order.orderedAt);

                return (
                    orderDate.getDate() === now.getDate() &&
                    orderDate.getMonth() === now.getMonth() &&
                    orderDate.getFullYear() === now.getFullYear()
                );
            }).length;
        },

        averageOrderValue() {
            if (this.contentStore.orders.length === 0) return 0;

            const totalRevenue = this.contentStore.orders.reduce((sum, order) => {
                return sum + (order.totalCost || 0);
            }, 0);

            return (totalRevenue / this.contentStore.orders.length).toFixed(2);
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
        getStatusIcon(status) {
            switch (status) {
                case "completed":
                    return new URL(`../../../assets/svgs/fulfilled.svg`, import.meta.url)
                        .href;
                case "cancelled":
                    return new URL(`../../../assets/svgs/cancelled.svg`, import.meta.url)
                        .href;
                case "refunded":
                    return new URL(`../../../assets/svgs/refunded.svg`, import.meta.url)
                        .href;
                default:
                    return new URL(`../../../assets/svgs/pending.svg`, import.meta.url).href;
            }
        },

        // Method to handle actions dropdown
        handleActions(orderId, event) {
            // Toggle open/close
            this.activeActionsId =
                this.activeActionsId === orderId ? null : orderId;
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

        // Method to handle viewing order details  
        viewDetails(orderId) {
            this.handleActions(orderId);
            this.$router.push({ name: "order-details", params: { id: orderId } });
        },
    },
};
</script>
