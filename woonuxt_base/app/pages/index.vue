<script setup lang="ts">
import { TaxonomyEnum } from '#woo';

const { setProducts, updateProductList } = useProducts();
const route = useRoute();
const { storeSettings } = useAppConfig();
const { isQueryEmpty } = useHelpers();

const { data } = await useAsyncGql('getProducts');
const allProducts = data.value?.products?.nodes as Product[];
setProducts(allProducts);

const hasProducts = computed<boolean>(() => Array.isArray(allProducts) && allProducts.length > 0);

const { data: termsData } = await useAsyncGql('getAllTerms', {
  taxonomies: [TaxonomyEnum.PRODUCTCATEGORY],
});
const productCategoryTerms = termsData.value?.terms?.nodes?.filter((term) => term.taxonomyName === 'product_cat');

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
});

watch(
  () => route.query,
  () => {
    if (route.name !== 'products') return;
    updateProductList();
  },
);
const animatedTitle = ref('');
let animator: AnimatedTitle;
onMounted(() => {
  animator = new AnimatedTitle((value: string) => {
    animatedTitle.value = value;
  });
  animator.animate('Shop');
});

useHead({
  title: 'Shop',
  meta: [{ name: 'description', content: 'Discover our products' }],
});
</script>

<template>
  <main>
    <div class="p-4 border-b">
      <h1 class="text-8xl">
        <a href="/" id="Shop">{{ animatedTitle }}</a>
      </h1>
    </div>
    <div class="p-4 border-b">
      <CategoryFilter :terms="productCategoryTerms" />
    </div>
    <div class="flex items-center justify-between w-full gap-4 p-4 md:gap-8 border-b">
      <ProductResultCount />
      <OrderByDropdown class="hidden md:inline-flex" v-if="storeSettings.showOrderByDropdown" />
      <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" />
    </div>
    <div class="container flex items-start" v-if="hasProducts">
      <div class="w-full border-x">
        <ProductGrid />
      </div>
    </div>
    <NoProductsFound v-else>No products found. Please try adjusting your filters or check back later.</NoProductsFound>
  </main>
</template>

<style lang="postcss">
#Shop {
  text-decoration: none;
}
</style>
