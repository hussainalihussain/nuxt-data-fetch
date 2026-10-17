<script setup lang="ts">
defineProps<{
    category: string
}>()
</script>

<template>
    <li class="my-2 capitalize">
        {{ category }}
    </li>
</template>