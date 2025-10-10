<script setup lang="ts">
import { ref } from "vue";

const { product } = defineProps({
  product: { type: Object as PropType<Product>, required: true },
});
const { storeSettings } = useAppConfig();

// Tabs: Description (0), Specifications (1), Reviews (2)
const hasDescription = !!product.description;
const hasSpecifications = !!product.attributes?.nodes?.length;
const hasReviews = !!storeSettings.showReviews;

const initialTab = hasDescription ? 0 : hasSpecifications ? 1 : 2;
const show = ref(initialTab);
</script>

<template>
  <div>
    <nav class="border-b flex gap-8 tabs">
      <!-- Description -->
      <button
        v-if="hasDescription"
        type="button"
        :class="show === 0 ? 'active' : ''"
        @click.prevent="show = 0"
      >
        {{ $t("messages.shop.productDescription") }}
      </button>

      <!-- Specifications -->
      <button
        v-if="hasSpecifications"
        type="button"
        :class="show === 1 ? 'active' : ''"
        @click.prevent="show = 1"
      >
        Specifications
      </button>

      <!-- Reviews -->
      <button
        v-if="hasReviews"
        type="button"
        :class="show === 2 ? 'active' : ''"
        @click.prevent="show = 2"
      >
        {{ $t("messages.shop.reviews") }} ({{ product.reviewCount }})
      </button>
    </nav>

    <!-- Tab Content -->
    <div class="tab-contents">
      <!-- Description -->
      <div
        v-if="show === 0 && hasDescription"
        class="font-light mt-8 prose"
        v-html="product.description"
      />

      <!-- Specifications -->
      <div v-if="show === 1 && hasSpecifications" class="mt-8">
        <table class="w-full border-y border-black border-collapse text-sm">
          <tbody>
            <tr
              v-for="attr in product?.attributes?.nodes ?? []"
              :key="attr?.id"
              class="border-b border-black"
            >
              <th
                scope="row"
                class="border-r border-black text-left p-2 font-medium w-1/3 align-top"
              >
                {{ attr?.label }}
              </th>
              <td class="p-2 align-top">
                {{ (attr?.options ?? []).join(", ") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Reviews -->
      <ProductReviews v-if="show === 2 && hasReviews" :product="product" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.tabs button {
  @apply border-transparent border-b-2 text-lg pb-8;
  margin-bottom: -1px;
}
.tabs button.active {
  @apply border-primary text-primary;
}
</style>
