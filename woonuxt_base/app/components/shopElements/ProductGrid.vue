<script setup lang="ts">
const route = useRoute();
const { productsPerPage } = useHelpers();
const { products } = useProducts();
const page = ref(parseInt(route.params.pageNumber as string) || 1);
const productsToShow = computed(() =>
  products.value.slice(
    (page.value - 1) * productsPerPage,
    page.value * productsPerPage
  )
);

// Number of columns in your grid
const columns = 4; // Change to match your grid-template-columns

// Calculate empty cells needed for last row
const emptyCells = computed(() => {
  const remainder = productsToShow.value.length % columns;
  return remainder === 0 ? 0 : columns - remainder;
});
</script>

<template>
  <Transition name="fade" mode="out-in">
    <section v-if="!!products.length" class="relative w-full">
      <TransitionGroup
        name="shrink"
        tag="div"
        mode="in-out"
        class="product-grid"
      >
        <div
          v-for="(node, i) in productsToShow"
          :key="node.id || i"
          class="bg-gray-100"
        >
          <ProductCard :node="node" :index="i" />
        </div>
        <!-- Render empty cells to fill the last row -->
        <div
          v-for="n in emptyCells"
          :key="'empty-' + n"
          class="bg-gray-100 pointer-events-none"
        />
      </TransitionGroup>
      <Pagination />
    </section>
    <NoProductsFound v-else />
  </Transition>
</template>

<style lang="postcss" scoped>
.product-grid {
  @apply min-h-[600px] grid gap-[1px] bg-black;
  margin: 0;
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}
</style>
