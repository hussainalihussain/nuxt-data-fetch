<script setup lang="ts">

const { data: products, pending } = await useFetch<ProductPreview[]>('https://fakestoreapi.com/products', {
  transform: (products) =>
    products.map(({ id, title, image }) => ({ id, title, image })),
});
</script>
<template>
    <div>
        <div v-if="pending">
            <p>Loading...</p>
        </div>
        <div v-else class="grid grid-cols-5 gap-4">
            <ProductCard v-for="(product, index) in products" :id="product.id" :key="product.id" :image="product.image"
                :title="product.title" />
        </div>
    </div>
</template>