<script setup>
import { ref, watch, computed } from "vue";

const { toggleCart, cart } = useCart();

const blink = ref(false);

// total cart count
const cartCount = computed(() => cart.value?.contents?.itemCount || 0);

// watch for count increase
watch(cartCount, (newCount, oldCount) => {
  if (newCount > (oldCount || 0)) {
    blink.value = true;
    setTimeout(() => (blink.value = false), 600);
  }
});
</script>

<template>
  <div
    class="relative cursor-pointer inline-flex"
    title="Cart"
    @click="toggleCart"
  >
    <Icon name="ion:cart-outline" size="22" class="mr-1 md:mr-0" />

    <ClientOnly>
      <Transition name="popIn" mode="out-in">
        <span
          v-if="cartCount > 0"
          class="rounded-full text-white leading-none min-w-[16px] p-[3px] -top-1 -right-1 md:-right-2 text-[10px] absolute inline-flex justify-center items-center transition-all duration-300"
          :class="[blink ? 'animate-blink bg-blue-500' : 'bg-primary']"
        >
          {{ cartCount }}
        </span>
      </Transition>
    </ClientOnly>
  </div>
</template>

<style lang="postcss">
/* popIn animation */
.popIn-enter-active,
.popIn-leave-active {
  transition: all 200ms cubic-bezier(0, 0, 0.57, 1.61);
}

.popIn-enter-from,
.popIn-leave-to {
  transform: scale(0);
}

/* blink animation */
@keyframes blink {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    background-color: theme("colors.black");
    transform: scale(2);
  }
}

.animate-blink {
  animation: blink 0.5s ease-in-out;
}
</style>
