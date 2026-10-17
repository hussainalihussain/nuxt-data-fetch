<script setup lang="ts">
defineProps<{
    href: string;
    text: string;
}>();
</script>
<template>
    <li>
        <NuxtLink :href="href"
            class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">
            {{ text }}
        </NuxtLink>
    </li>
</template>
