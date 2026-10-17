<script setup lang="ts">
import AppNavigation from '~/components/AppNavigation.vue';

</script>

<template>
    <div>
        <app-navigation />
        <div class="mt-[3.6rem]">
            <slot />
        </div>
    </div>
</template>