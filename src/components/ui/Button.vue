<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue";
import cn from "../../utils/cn";

const props = defineProps</* @vue-ignore */ ButtonHTMLAttributes>();
</script>

<template>
    <button
        v-bind="props"
        :class="
            cn(
                'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-400 transition-colors px-4 py-1 rounded-md',
                props.class
            )
        "
    >
        <slot></slot>
    </button>
</template>
