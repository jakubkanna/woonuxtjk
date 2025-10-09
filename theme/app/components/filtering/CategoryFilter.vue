<script setup>
import { ref } from "vue";
const { setFilter } = useFiltering();

const props = defineProps({
  terms: { type: Array, required: true },
  label: { type: String, default: "" },
  showCount: { type: Boolean, default: false },
});

// Track selected category
const selectedCategory = ref(null);

const selectCategory = (slug) => {
  if (selectedCategory.value === slug) {
    selectedCategory.value = null;
    setFilter("category", []);
  } else {
    selectedCategory.value = slug;
    setFilter("category", [slug]);
  }
};
</script>

<template>
  <div class="py-3">
    <div class="flex flex-wrap items-center gap-2">
      <span class="font-mono">Filter by:</span>
      <template v-for="term in terms" :key="term.slug">
        <button
          class="btn btn-sm btn-outline-dark mx-1 px-3 py-1 rounded border border-black text-black hover:bg-black hover:text-white transition text-sm"
          :class="{
            'bg-black text-white border-black text-xl':
              selectedCategory === term.slug,
          }"
          @click="selectCategory(term.slug)"
        >
          <span v-html="term.name" />
          <small
            v-if="showCount"
            class="ml-1 text-gray-400 tabular-nums"
            aria-hidden="true"
          >
            ({{ term.count || 0 }})
          </small>
        </button>
      </template>
    </div>
  </div>
</template>
