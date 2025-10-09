<script setup lang="ts">
const { siteName } = useAppConfig();
</script>

<template>
  <NuxtLink to="/" class="inline-flex items-center gap-2">
    <div class="flex items-center gap-2 text-lg">
      <span>{{ siteName }}</span>
    </div>
  </NuxtLink>
</template>
