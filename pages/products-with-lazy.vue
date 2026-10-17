<script setup lang="ts">
// const { pending, data: products } = useFetch<Product[]>('https://fakestoreapi.com/products', {
//     lazy: false
// });

// an alternative same thing:
const { pending, data: products } = useLazyFetch<Product[]>('https://fakestoreapi.com/products');
</script>
<template>
    <div>
        <div v-if="pending">
            <p>Loading...</p>
        </div>
        <div v-else class="grid grid-cols-5 gap-4">
            <ProductCard
                v-for="(product, index) in products"
                :id="product.id"
                :key="index"
                :image="product.image"
                :title="product.title"
            />
        </div>
    </div>
</template>