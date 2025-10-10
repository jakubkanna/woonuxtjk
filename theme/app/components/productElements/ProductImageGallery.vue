<script setup lang="ts">
const { FALLBACK_IMG } = useHelpers();

const props = defineProps({
  mainImage: { type: Object, required: true },
  gallery: { type: Object, required: true },
  node: { type: Object as PropType<Product | Variation>, required: true },
  activeVariation: { type: Object, required: false },
});

const primaryImage = computed(() => ({
  sourceUrl: props.mainImage.sourceUrl || FALLBACK_IMG,
  title: props.mainImage.title,
  altText: props.mainImage.altText,
  databaseId: props.mainImage.databaseId,
}));

const imageToShow = ref(primaryImage.value);

const galleryImages = computed(() => {
  // Add the primary image to the start of the gallery and remove duplicates
  return [primaryImage.value, ...props.gallery.nodes].filter(
    (img, index, self) =>
      index === self.findIndex((t) => t?.databaseId === img?.databaseId)
  );
});

const changeImage = (image: any) => {
  if (image) imageToShow.value = image;
};

watch(
  () => props.activeVariation,
  (newVal) => {
    if (newVal?.image) {
      const foundImage = galleryImages.value.find(
        (img) => img.databaseId === newVal.image?.databaseId
      );
      if (foundImage) imageToShow.value = foundImage;
    }
  }
);

const imgWidth = 640;
</script>

<template>
  <div>
    <SaleBadge :node class="absolute text-base top-4 right-4" />
    <NuxtImg
      class="object-contain w-full min-w-[350px]"
      :class="{
        'border-b border-black': gallery.nodes.length, // conditionally adds these classes
      }"
      :width="imgWidth"
      :height="imgWidth"
      :alt="imageToShow.altText || node.name"
      :title="imageToShow.title || node.name"
      :src="imageToShow.sourceUrl || FALLBACK_IMG"
      fetchpriority="high"
      placeholder
      placeholder-class="blur-xl"
    />
    <div v-if="gallery.nodes.length" class="gallery-images">
      <NuxtImg
        v-for="galleryImg in galleryImages"
        :key="galleryImg.databaseId"
        class="cursor-pointer"
        :width="imgWidth"
        :height="imgWidth"
        :src="galleryImg.sourceUrl"
        :alt="galleryImg.altText || node.name"
        :title="galleryImg.title || node.name"
        placeholder
        placeholder-class="blur-xl"
        loading="lazy"
        @click.native="changeImage(galleryImg)"
      />
    </div>
  </div>
</template>

<style scoped>
.gallery-images {
  display: flex;
  overflow: auto;
  gap: 1px;
  background-color: black;
  width: max-content;
}

.gallery-images img {
  width: 72px;
  aspect-ratio: 5/6;
  object-fit: cover;
}

.gallery-images img:last-child {
  padding-right: 1px;
}
</style>
