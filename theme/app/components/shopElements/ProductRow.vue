<script setup>
const props = defineProps({
  products: { type: Array, default: null },
});
</script>

<template>
  <div v-if="products" class="flex" id="YouMayLikeGrid">
    <ProductCard
      v-for="(node, i) in products"
      :key="node.databaseId"
      class="bg-gray-100 min-w-[200px] max-w-[300px] flex-1"
      :node="node"
      :index="i"
      :class="{
        hidden: i === products.length - 1,
        'lg:block': i === products.length - 1,
      }"
    />
  </div>
</template>

<style lang="postcss" scoped>
#YouMayLikeGrid {
  gap: 1px;
  background-color: black;
  width: fit-content;
  padding-right: 1px;
}
</style>
