<template>
  <div
    class="w-screen h-screen fixed top-0 left-0 bg-black/50 z-50 flex items-center justify-center"
  >
    <div
      class="w-[320px] h-fit p-[16px] flex flex-col items-start gap-[24px] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1), 0_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-[4px]"
    >
      <div class="w-full flex flex-col gap-[8px]">
        <!-- h1 -->
        <div class="flex gap-[4px] items-center text-[16px] leading-[150%] font-semibold">
          <div class="size-[18px]">
            <img
              class="size-full object-cover"
              src="../assets/svgs/error.svg"
              alt="error-icon"
            />
          </div>
          <h1>{{ header }}</h1>
        </div>

        <!-- p -->
        <p
          class="text-[14px] opacity-50 font-medium text-[#000] leading-[120%]"
        >
          {{ message }}
        </p>
      </div>
      <div class="flex gap-[8px] self-end">
        <button class="btn-prim px-[16px] py-[8px] self-end" @click="close">
          Cancel
        </button>
        <button class="btn-error px-[16px] py-[8px] self-end" @click="confirm">
          {{ actionText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Confirmation-Modal",
  props: {
    header: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    actionText: {
      type: String,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("confirm");
    },
  },
};
</script>
