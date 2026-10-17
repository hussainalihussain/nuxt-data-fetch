<script setup lang="ts">
</script>
<template>
    <nav class="bg-neutral-50 fixed w-full z-20 top-0 start-0 border-b border-default">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div class="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul
                    class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-50">
                    <AppNavigationLink href="/" text="Home" />
                    <AppNavigationLink href="/products" text="Products" />
                    <AppNavigationLink href="/products-with-lazy" text="Products with Lazy" />
                    <AppNavigationLink href="/products-with-no-server" text="Products with No Server" />
                </ul>
            </div>
        </div>
    </nav>
</template>