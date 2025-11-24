<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})

const handleClick = (url) => {
  if (url) window.open(url, '_blank')
}
</script>

<template>
  <div
    class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow max-w-xs"
    @click="handleClick(data.actionUrl)"
  >
    <img v-if="data.imageUrl" :src="data.imageUrl" class="w-full h-32 object-cover rounded mb-2" />
    <h3 class="font-bold text-gray-800">{{ data.title }}</h3>
    <p class="text-sm text-gray-600 mt-1">{{ data.description }}</p>
  </div>
</template>
