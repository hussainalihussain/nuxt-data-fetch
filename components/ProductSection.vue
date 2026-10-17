<script setup lang="ts">
defineProps<{
    products: ProductPreview[] | undefined,
}>()
const emit = defineEmits<{
    (e: 'refresh'): void
}>()
</script>
<template>
    <div class="col-span-4 py-2">
        <div class="flex justify-between">
            <h2 class="text-xl font-semibold">Products</h2>

            <button
                @click="emit('refresh')"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded float-right">
                Refresh
            </button>
        </div>
        <div class="grid grid-cols-3">
            <ProductCard v-for="(product, index) in products" :key="product.id" :id="product.id"
                :image="product.image" :title="product.title" />
        </div>
    </div>
</template>