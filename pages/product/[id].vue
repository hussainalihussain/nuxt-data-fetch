<script setup lang="ts">
const route = useRoute();

const { data: product } = await useFetch<Product>(`https://fakestoreapi.com/products/${route.params.id}`, {
    /**
     * get only the title and image properties from the response object
     * same to transform but it is for simple object and transform is for array of objects
     */
    pick: ['title', 'image']
});
</script>
<template>
    <div>
        <h1>{{ product?.title }}</h1>
        <img :src="product?.image" :alt="product?.title" class="w- h-auto h-auto self-center" 75px="">
    </div>
</template>