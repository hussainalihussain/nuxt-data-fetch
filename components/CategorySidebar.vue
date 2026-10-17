<script setup lang="ts">
defineProps<{
    categories: string[] | undefined
}>()
</script>

<template>
    <div class="col-span-1 rounded-md shadow border border-gray-100 p-4">
        <h2 class="text-xl font-semibold">Categories</h2>
        <ul v-if="categories?.length">
            <CategoryItem
                v-for="category in categories"
                :key="category"
                :category="category"
            />
        </ul>
    </div>
</template>