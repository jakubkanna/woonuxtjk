<script setup>
const { cart, toggleCart } = useCart();
const props = defineProps({
  disabled: { type: Boolean, default: false },
});
const isLoading = ref(false);
const { t } = useI18n();
const addToCartButtonText = computed(() =>
  isLoading.value ? t("messages.shop.adding") : t("messages.shop.addToCart")
);

// stop loading when cart is updated
watch(cart, (newCart, oldCart) => {
  isLoading.value = false;

  if (newCart?.contents?.itemCount > oldCart?.contents?.itemCount) {
    setTimeout(() => {
      toggleCart();
    }, 500);
  }
});
</script>

<template>
  <button
    type="submit"
    class="flex font-bold bg-primary hover:bg-primary-dark text-white text-center items-center justify-center focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
    :disabled="props.disabled"
    @click="isLoading = true"
  >
    <span>{{ addToCartButtonText }}</span>
    <LoadingIcon v-if="isLoading" stroke="4" size="12" color="#fff" />
  </button>
</template>

<style lang="postcss" scoped>
button {
  outline: none !important;
  transition: all 150ms ease-in;
}
</style>
