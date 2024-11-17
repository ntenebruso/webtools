<script setup lang="ts">
import Header from "./components/Header.vue";
import { RouterView } from "vue-router";
</script>

<template>
    <Header></Header>
    <main class="container">
        <RouterView />
    </main>
</template>
