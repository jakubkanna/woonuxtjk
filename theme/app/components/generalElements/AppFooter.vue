<script setup lang="ts">
const { wooNuxtVersionInfo } = useHelpers();
const { wishlistLink } = useAuth();
</script>

<template>
  <footer class="order-last bg-kanna border-t border-black">
    <div
      class="container flex flex-wrap justify-between gap-12 my-24 md:gap-24"
    >
      <div class="mr-auto">
        <WebsiteShortDescription />
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="text-lg grid">
          <a target="_blank" href="https://jakubkanna.com/bio">About</a>
          <a target="_blank" href="https://jakubkanna.com/blog">Blog</a>
          <a target="_blank" href="https://jakubkanna.com/works">Artworks</a>
        </div>
      </div>

      <div class="w-3/7 lg:w-auto">
        <div class="grid text-lg">
          <a href="https://jakubkanna.com/contact" target="_blank"
            >Contact Us</a
          >
          <a href="/">Shipping & Returns</a>
          <a href="/">Privacy Policy</a>
          <a href="/">Terms & Conditions</a>
        </div>
      </div>
    </div>
    <div class="border-t border-black flex items-center justify-center">
      <div class="copywrite">
        <p class="py-4 text-xs text-center">
          &copy; {{ new Date().getFullYear() }}
          JAKUB KANNA
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="postcss">
a {
  @apply hover:underline;
}
</style>
