<script setup lang="ts">
import { RouterLink } from "vue-router";
import Button from "../components/ui/Button.vue";
import { tools } from "../tools";
</script>

<template>
    <h1 class="mt-4 text-4xl font-bold">Online WebTools</h1>
    <p class="mt-2 text-lg">
        This website hosts a collection of open-source, locally-running tools
        that I wrote, mainly because I couldn't find simple non-cloud based
        alternatives online that fit my neeeds. Enjoy!
    </p>
    <h2 class="mt-4 text-3xl font-bold">All Tools</h2>
    <RouterLink v-for="tool in tools" :to="tool.path" v-slot="{ navigate }">
        <div
            @click="navigate"
            class="relative flex mt-2 group items-center bg-zinc-800 hover:cursor-pointer rounded-md px-4 py-2 after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-md after:bg-zinc-700 after:-translate-x-2 after:translate-y-2 hover:after:translate-x-0 hover:after:translate-y-0 after:opacity-0 hover:after:opacity-100 after:transition-all"
        >
            <div class="z-10 flex-1">
                <h3 class="font-bold text-3xl">{{ tool.title }}</h3>
                <p>{{ tool.description }}</p>
            </div>
            <span
                class="z-10 font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-blue-400"
                >Go to Tool</span
            >
        </div>
    </RouterLink>
</template>
