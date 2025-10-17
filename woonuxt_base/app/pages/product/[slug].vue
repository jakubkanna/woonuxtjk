<script lang="ts" setup>
import { StockStatusEnum, ProductTypesEnum, type AddToCartInput } from '#woo';

const route = useRoute();
const { storeSettings } = useAppConfig();
const { arraysEqual, formatArray, checkForVariationTypeOfAny } = useHelpers();
const { addToCart, isUpdatingCart } = useCart();
const { t } = useI18n();
const slug = route.params.slug as string;

const { data } = await useAsyncGql('getProduct', { slug });
if (!data.value?.product) {
  throw showError({
    statusCode: 404,
    statusMessage: t('messages.shop.productNotFound'),
  });
}
await nextTick();

const product = ref<Product>(data?.value?.product);
const quantity = ref<number>(1);
const activeVariation = ref<Variation | null>(null);
const variation = ref<VariationAttribute[]>([]);
const indexOfTypeAny = computed<number[]>(() => checkForVariationTypeOfAny(product.value));
const attrValues = ref();
const isSimpleProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.SIMPLE);
const isVariableProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.VARIABLE);
const isExternalProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.EXTERNAL);

const type = computed(() => activeVariation.value || product.value);
const selectProductInput = computed<any>(() => ({
  productId: type.value?.databaseId,
  quantity: quantity.value,
})) as ComputedRef<AddToCartInput>;

const mergeLiveStockStatus = (payload: Product): void => {
  product.value.stockStatus = payload.stockStatus ?? product.value?.stockStatus;

  payload.variations?.nodes?.forEach((variation: Variation, index: number) => {
    if (product.value?.variations?.nodes[index]) {
      product.value.variations.nodes[index].stockStatus = variation.stockStatus;
    }
  });
};

onMounted(async () => {
  try {
    const { product } = await GqlGetStockStatus({ slug });
    if (product) mergeLiveStockStatus(product as Product);
  } catch (error: any) {
    const errorMessage = error?.gqlErrors?.[0].message;
    if (errorMessage) console.error(errorMessage);
  }
});

const updateSelectedVariations = (variations: VariationAttribute[]): void => {
  if (!product.value.variations) return;

  attrValues.value = variations.map((el) => ({
    attributeName: el.name,
    attributeValue: el.value,
  }));
  const clonedVariations = JSON.parse(JSON.stringify(variations));
  const getActiveVariation = product.value.variations?.nodes.filter((variation: any) => {
    // If there is any variation of type ANY set the value to ''
    if (variation.attributes) {
      // Set the value of the variation of type ANY to ''
      indexOfTypeAny.value.forEach((index) => (clonedVariations[index].value = ''));

      return arraysEqual(formatArray(variation.attributes.nodes), formatArray(clonedVariations));
    }
  });

  // Set variation to the selected variation if it exists
  activeVariation.value = getActiveVariation?.[0] || null;

  selectProductInput.value.variationId = activeVariation.value?.databaseId ?? null;
  selectProductInput.value.variation = activeVariation.value ? attrValues.value : null;
  variation.value = variations;
};

const stockStatus = computed(() => {
  if (isVariableProduct.value) {
    return activeVariation.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
  }
  return type.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
});

const disabledAddToCart = computed(() => {
  const isOutOfStock = stockStatus.value === StockStatusEnum.OUT_OF_STOCK;
  const isInvalidType = !type.value;
  const isCartUpdating = isUpdatingCart.value;
  const isValidActiveVariation = isVariableProduct.value ? !!activeVariation.value : true;
  return isInvalidType || isOutOfStock || isCartUpdating || !isValidActiveVariation;
});
</script>

<template>
  <main class="container relative xl:max-w-7xl border-x p-0">
    <div v-if="product">
      <SEOHead :info="product" />
      <Breadcrumb :product class="p-4 border-b" v-if="storeSettings.showBreadcrumbOnSingleProduct" />

      <div class="flex flex-col md:flex-row md:justify-between border-b">
        <!-- left -->
        <ProductImageGallery
          v-if="product.image"
          class="relative flex-1"
          :main-image="product.image"
          :gallery="product.galleryImages!"
          :node="type"
          :activeVariation="activeVariation || {}" />
        <NuxtImg v-else class="relative flex-1 skeleton" src="/images/placeholder.jpg" :alt="product?.name || 'Product'" />
        <!-- right -->
        <div class="lg:max-w-md xl:max-w-lg w-full border-l flex flex-col">
          <div class="flex justify-between border-b p-4 border-t md:border-t-0">
            <div class="flex-1">
              <h1 class="flex flex-wrap items-center gap-2 mb-2 text-2xl font-sesmibold">
                {{ type.name }}
                <LazyWPAdminLink :link="`/wp-admin/post.php?post=${product.databaseId}&action=edit`">Edit</LazyWPAdminLink>
              </h1>
              <StarRating :rating="product.averageRating || 0" :count="product.reviewCount || 0" v-if="storeSettings.showReviews" />
            </div>
            <ProductPrice class="text-xl" :sale-price="type.salePrice" :regular-price="type.regularPrice" />
          </div>

          <div class="grid gap-2 text-sm empty:hidden border-b p-4">
            <div v-if="!isExternalProduct && stockStatus !== StockStatusEnum.IN_STOCK" class="flex items-center gap-2">
              <StockStatus :stockStatus @updated="mergeLiveStockStatus" />
            </div>
          </div>

          <div v-if="product.shortDescription" class="font-light prose border-b p-4" v-html="product.shortDescription" />

          <form @submit.prevent="addToCart(selectProductInput)" class="flex-1 flex flex-col justify-between">
            <AttributeSelections
              v-if="isVariableProduct && product.attributes && product.variations"
              class="flex-1 p-4 border-b"
              :attributes="product.attributes.nodes"
              :defaultAttributes="product.defaultAttributes"
              :variations="product.variations.nodes"
              @attrs-changed="updateSelectedVariations" />

            <div v-if="isVariableProduct || isSimpleProduct" class="p-4">
              <input
                v-model="quantity"
                type="number"
                min="1"
                aria-label="Quantity"
                class="m-2 p-2 flex text-left max-w-16 items-center justify-center focus:outline-none" />
            </div>

            <div class="flex">
              <AddToCartButton class="flex-1 w-full py-8 border-t h-[87px]" :disabled="disabledAddToCart" :class="{ loading: isUpdatingCart }" />
              <div class="flex flex-wrap p-4 px-6 border-t border-l">
                <WishlistButton :product />
              </div>
            </div>

            <a
              v-if="isExternalProduct && product.externalUrl"
              :href="product.externalUrl"
              target="_blank"
              class="flex font-bold bg-gray-800 text-white text-center min-w-[150px] p-2.5 gap-4 items-center justify-center focus:outline-none">
              {{ product?.buttonText || 'View product' }}
            </a>
          </form>

          <div v-if="storeSettings.showProductCategoriesOnSingleProduct && product.productCategories"></div>
        </div>
      </div>
      <!-- tabs -->
      <div v-if="product.description || product.reviews">
        <ProductTabs :product />
      </div>
      <!--  -->
      <div v-if="product.related && storeSettings.showRelatedProducts">
        <div class="p-4 text-xl font-semibold border-b uppercase">
          {{ $t('messages.shop.youMayLike') }}
        </div>
        <LazyProductRow :products="product.related.nodes" class="flex overflow-x-auto w-full" style="scrollbar-width: thin" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.product-categories > a:last-child .comma {
  display: none;
}

input[type='number']::-webkit-inner-spin-button {
  opacity: 1;
}
</style>
