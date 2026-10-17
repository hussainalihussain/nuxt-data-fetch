<script setup lang="ts">
defineProps<{
    id: number;
    image: string;
    title: string;
}>();
</script>
<template>
    <NuxtLink :href="`/product/${id}`" class="flex flex-col shadow-md bg-white p-6 rounded-md">
        <img :src="image" :alt="title" class="w- h-auto h-auto self-center" 75px="">
        <h2 class="text-black mt-auto text-sm">{{ title }}</h2>
    </NuxtLink>
</template>