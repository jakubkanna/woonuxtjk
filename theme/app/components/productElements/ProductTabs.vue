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
    <nav class="tabs flex border-b border-black bg-black">
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
    <div class="tab-contents border-b border-black">
      <!-- Description -->
      <div
        v-if="show === 0 && hasDescription"
        class="text-black prose p-4"
        v-html="product.description"
      />

      <!-- Specifications -->
      <div v-if="show === 1 && hasSpecifications" class="m-8">
        <table class="w-full border-black border-collapse text-sm">
          <tbody>
            <tr
              v-for="attr in product?.attributes?.nodes ?? []"
              :key="attr?.id"
            >
              <th scope="row">{{ attr?.label }}</th>
              <td>{{ (attr?.options ?? []).join(", ") }}</td>
            </tr>
            <tr>
              <th>{{ $t("messages.shop.sku") }}</th>
              <td>
                <div v-if="storeSettings.showSKU && product.sku">
                  {{ product.sku || "N/A" }}
                </div>
              </td>
            </tr>
            <tr>
              <th>{{ $t("messages.shop.category", 3) }}</th>
              <td>
                <div class="product-categories">
                  <NuxtLink
                    v-for="category in product.productCategories.nodes"
                    :key="category.databaseId"
                    :to="`/product-category/${decodeURIComponent(category?.slug || '')}`"
                    class="hover:text-primary"
                    :title="category.name || ''"
                    >{{ category.name }}<span class="comma"> </span>
                  </NuxtLink>
                </div>
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
.tabs {
  @apply border-b border-black bg-black;
  gap: 1px;
}

.tabs button {
  @apply flex-1 text-white py-4 text-center font-medium transition-colors bg-gray-100;
  color: black;
}

.tabs button:last-child {
  border-right: none;
}

/* active state */
.tabs button.active {
  background: black;
  color: white;
}

/* Table container */
table {
  @apply w-full border-collapse text-sm;
  border: 1px solid black;
}

/* Table rows */
table tr {
  @apply border-b border-black;
}

/* Table headers */
table th {
  @apply border-r border-black text-left p-2 font-medium align-top;
  width: 33%;
}

/* Table data cells */
table td {
  @apply p-2 align-top;
}
</style>
