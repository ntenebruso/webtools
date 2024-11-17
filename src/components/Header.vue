<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
    <header className="container flex justify-between items-center py-2">
        <RouterLink to="/"
            ><span
                className="font-bold text-3xl hover:text-blue-500 transition-colors"
                >WebTools</span
            ></RouterLink
        >
        <span>
            {{ route.meta.title ? route.meta.title : "" }}
        </span>
    </header>
</template>
