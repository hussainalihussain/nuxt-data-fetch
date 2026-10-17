<script setup lang="ts">
const { pending, error, productInfo, refresh } = useProductsAndCategories();
</script>
<template>
    <div v-if="pending">
        <p>Loading...</p>
    </div>
    <div v-else-if="error">
        <h1 class="text-xl text-red-500">Error comes in</h1>
        <p>Code: {{ error.status }}</p>
        <p>Message: {{ error.message }}</p>
    </div>
    <div v-else>
        <div class="grid grid-cols-5 gap-4">
            <ProductSection :products="productInfo?.products" @refresh="refresh" />
            <CategorySidebar :categories="productInfo?.categories" />
        </div>
    </div>
</template>