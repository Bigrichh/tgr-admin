<template>
  <div
    class="w-screen h-screen fixed top-0 left-0 bg-black/50 z-50 flex items-center justify-center"
  >
    <div
      class="w-[320px] h-fit p-[16px] flex flex-col items-start gap-[24px] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1), 0_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-[4px]"
    >
      <div class="w-full flex flex-col gap-[8px]">
        <!-- h1 -->
        <div class="text-[16px] leading-[150%] font-semibold">
          <div v-if="state === 'error'" class="flex gap-[4px] items-center">
            <div class="size-[18px]">
              <img
                class="size-full object-cover"
                src="../assets/svgs/error.svg"
                alt="error-icon"
              />
            </div>
            <h1>Error</h1>
          </div>

          <div v-else class="flex gap-[4px] items-center">
            <div class="size-[18px]">
              <img
                class="size-full object-cover"
                src="../assets/svgs/success.svg"
                alt="success-icon"
              />
            </div>
            <h1>Success</h1>
          </div>
        </div>
        <!-- p -->
        <p class="text-[14px] opacity-50 font-medium text-[#000] leading-[120%]">
          {{ message }}
        </p>
      </div>
      <button class="btn-prim px-[16px] py-[8px] self-end" @click="close">
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Status-Modal",
  props: {
    message: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>
