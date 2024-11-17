<script setup lang="ts">
import type { SelectHTMLAttributes } from "vue";
import cn from "../../utils/cn";

const props = defineProps</* @vue-ignore */ SelectHTMLAttributes>();
const model = defineModel<string>();
</script>

<template>
    <select
        v-bind="props"
        :class="
            cn(
                'block bg-zinc-700 disabled:text-zinc-400 px-4 py-2 rounded-md border border-zinc-600 focus:ring-2 focus:ring-blue-500 w-full',
                props.class
            )
        "
        v-model="model"
    >
        <slot></slot>
    </select>
</template>
