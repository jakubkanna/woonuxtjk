<script setup lang="ts">
const { cart, toggleCart, isUpdatingCart, emptyCart } = useCart();
</script>

<template>
  <div
    class="fixed top-0 bottom-0 right-0 z-50 flex flex-col w-11/12 max-w-lg overflow-x-hidden bg-gray-100 shadow-lg border-l border-black"
  >
    <div class="border-b border-black flex justify-between items-center p-4">
      <!-- Left: Close Icon -->
      <button class="p-1" @click="toggleCart(false)" aria-label="Close cart">
        <Icon name="ion:close-outline" size="34" />
      </button>

      <!-- Center: Cart Title & Count -->

      <div class="text-center font-bold">
        {{ $t("messages.shop.cart") }}
        <span v-if="cart?.contents?.productCount">
          ({{ cart?.contents?.productCount }})
        </span>
      </div>

      <!-- Right: Empty Cart Icon -->
      <button class="cursor-pointer" title="Empty Cart" @click="emptyCart">
        <TrashIcon />
      </button>
    </div>

    <ClientOnly>
      <template v-if="cart && !cart.isEmpty">
        <ul class="flex flex-col flex-1">
          <li
            v-for="item in cart.contents?.nodes"
            :key="item.key"
            class="border-b border-black last:mb-4"
          >
            <CartCard :item="item" />
          </li>
        </ul>

        <div>
          <NuxtLink
            class="w-full block p-6 text-lg text-center text-white bg-primary justify-evenly hover:bg-primary-dark border-t border-black font-bold"
            to="/checkout"
            @click.prevent="toggleCart()"
            id="CheckoutButton"
          >
            <span class="mx-2">{{ $t("messages.shop.checkout") }}</span>
            <span v-html="cart.total" />
          </NuxtLink>
        </div>
      </template>
    </ClientOnly>

    <!-- Cart Loading Overlay -->
    <div
      v-if="isUpdatingCart"
      class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-25"
    >
      <LoadingIcon />
    </div>
  </div>
</template>
<style lang="postcss">
#CheckoutButton {
  text-decoration: none;
}
</style>
