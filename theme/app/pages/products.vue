<script setup lang="ts">
const { setProducts, updateProductList } = useProducts();
const route = useRoute();
const { storeSettings } = useAppConfig();
const { isQueryEmpty } = useHelpers();

const { data } = await useAsyncGql("getProducts");
const allProducts = data.value?.products?.nodes as Product[];
setProducts(allProducts);

const hasProducts = computed<boolean>(
  () => Array.isArray(allProducts) && allProducts.length > 0
);

// Define the PRODUCTCATEGORY constant
const PRODUCTCATEGORY = "product_cat";

const { data: termsData } = await useAsyncGql("getAllTerms", {
  taxonomies: [PRODUCTCATEGORY],
});
const productCategoryTerms = termsData.value?.terms?.nodes?.filter(
  (term) => term.taxonomyName === "product_cat"
);

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
});

watch(
  () => route.query,
  () => {
    if (route.name !== "products") return;
    updateProductList();
  }
);

useHead({
  title: `Products`,
  meta: [{ name: "description", content: "Discover our products" }],
});
</script>

<template>
  <div class="p-4 border-b border-black">
    <h1 class="text-8xl">Shop</h1>
  </div>
  <div class="p-4 border-b border-black">
    <CategoryFilter :terms="productCategoryTerms" />
  </div>
  <div
    class="flex items-center justify-between w-full gap-4 p-4 md:gap-8 border-b border-black"
  >
    <ProductResultCount />
    <OrderByDropdown
      class="hidden md:inline-flex"
      v-if="storeSettings.showOrderByDropdown"
    />
    <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" />
  </div>
  <div class="container flex items-start" v-if="hasProducts">
    <div class="w-full border-x border-black">
      <ProductGrid />
    </div>
  </div>
  <NoProductsFound v-else
    >No products found. Please try adjusting your filters or check back
    later.</NoProductsFound
  >
</template>
