<script setup lang="ts">
const { addToWishlist, removeFromWishlist, isInList } = useWishlist();

const { product } = defineProps<{ product: Product }>();

const isWishlisted = computed(() =>
  product.databaseId ? isInList(product.databaseId) : false
);

const toggleWishlist = () =>
  isWishlisted.value && product.databaseId
    ? removeFromWishlist(product.databaseId)
    : addToWishlist(product);
</script>

<template>
  <button
    type="button"
    class="cursor-pointer items-center"
    @click="toggleWishlist"
  >
    <Icon v-if="isWishlisted" name="ion:heart" size="34" class="text-red-400" />
    <Icon
      v-else
      name="ion:heart-outline"
      size="34"
      class="hover:text-red-400"
    />
  </button>
</template>
