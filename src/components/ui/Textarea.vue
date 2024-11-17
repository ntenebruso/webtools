<script setup lang="ts">
import type { TextareaHTMLAttributes } from "vue";
import cn from "../../utils/cn";

const props = defineProps</* @vue-ignore */ TextareaHTMLAttributes>();
const model = defineModel<string>();
</script>

<template>
    <textarea
        v-bind="props"
        v-model="model"
        :class="
            cn(
                'block bg-zinc-700 disabled:text-zinc-400 p-2 rounded-md border border-zinc-600 focus:ring-2 focus:ring-blue-500 w-full outline-none font-mono',
                props.class
            )
        "
    ></textarea>
</template>
