<script setup lang="ts">
const props = defineProps({
  message: { type: String, required: true },
});
</script>

<template>
  <div class="w-full bg-green-200 border-b text-black text-sm text-center py-2 px-4 flex items-center justify-center gap-2">
    <span>{{ message }}</span>
  </div>
</template>
