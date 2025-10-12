<script setup lang="ts">
const { updateItemQuantity, isUpdatingCart, cart } = useCart();
const { debounce } = useHelpers();
const { item } = defineProps({ item: { type: Object, required: true } });

const productType = computed(() =>
  item.variation ? item.variation?.node : item.product?.node
);
const quantity = ref(item.quantity);
const hasNoMoreStock = computed(() =>
  productType.value.stockQuantity
    ? productType.value.stockQuantity <= quantity.value
    : false
);

const incrementQuantity = () => quantity.value++;
const decrementQuantity = () => {
  if (quantity.value > 0) quantity.value--;
};

// Debounced cart update
watch(
  quantity,
  debounce(() => {
    if (quantity.value !== "") updateItemQuantity(item.key, quantity.value);
  }, 250)
);

// Restore value if cleared manually
const onFocusOut = () => {
  if (quantity.value === "") {
    const cartItem = cart.value?.contents?.nodes?.find(
      (node) => node.key === item.key
    );
    if (cartItem) quantity.value = cartItem.quantity;
  }
};
</script>

<template>
  <div class="flex items-center gap-2 text-sm font-medium select-none">
    <!-- Decrease -->
    <span
      class="cursor-pointer hover:text-primary transition-colors"
      @click="!isUpdatingCart && quantity > 0 && decrementQuantity()"
    >
      −
    </span>

    <!-- Quantity -->
    <span class="min-w-[1.5rem] text-center">{{ quantity }}</span>

    <!-- Increase -->
    <span
      class="cursor-pointer hover:text-primary transition-colors"
      @click="!isUpdatingCart && !hasNoMoreStock && incrementQuantity()"
    >
      +
    </span>
  </div>
</template>

<style scoped>
/* Optional: make + and - slightly bolder or larger */
span:first-child,
span:last-child {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1;
}
</style>
