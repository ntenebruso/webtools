<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue";
import cn from "../../utils/cn";

interface Props extends /* @vue-ignore */ ButtonHTMLAttributes {
    variant?: "primary" | "secondary";
}

const props = withDefaults(defineProps<Props>(), {
    variant: "primary",
});
</script>

<template>
    <button
        v-bind="props"
        :class="
            cn(
                ' disabled:bg-zinc-700 disabled:text-zinc-400 transition-colors px-4 py-1 rounded-md',
                variant == 'primary' &&
                    'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
                variant == 'secondary' &&
                    'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600',
                props.class
            )
        "
    >
        <slot></slot>
    </button>
</template>
