<template>
    <div class="fixed top-0 z-50 h-full w-full bg-black/50 flex justify-center items-center">
        <span class="block size-[40px] my-0 mx-auto border-solid border-[3.5px] border-transparent border-t-white border-b-white rounded-full"></span>
    </div>
</template>

<script>
export default {
    name: "loading",
}
</script>

<style scoped>
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

span {
    animation: spin ease 1000ms infinite;
}
</style>