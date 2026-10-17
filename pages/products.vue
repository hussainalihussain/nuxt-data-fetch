<script setup lang="ts">
const { data: products } = await useFetch<Product[]>('https://fakestoreapi.com/products');
</script>
<template>
    <div class="grid grid-cols-5 gap-4">
        <ProductCard
            v-for="(product, index) in products"
            :key="index"
            :image="product.image"
            :title="product.title"
        />
    </div>
</template>