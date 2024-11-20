<script setup lang="ts">
import { computed, ref } from "vue";
import Textarea from "../../components/ui/Textarea.vue";

const mode = ref<"encode" | "decode">("encode");

const inputValue = ref("");
const outputValue = computed(() => {
    if (mode.value == "encode") {
        return encodeURIComponent(inputValue.value);
    }

    return decodeURIComponent(inputValue.value);
});
</script>

<template>
    <h1 class="mt-4 text-4xl font-bold">URL Encoder/Decoder</h1>
    <label for="inputField" class="text-lg mt-4 inline-block">Input:</label>
    <Textarea id="inputField" v-model="inputValue"></Textarea>

    <div class="mt-2 flex">
        <label for="encode">Encode</label>
        <input type="radio" id="encode" v-model="mode" value="encode" />
        <label for="decode" class="ml-2">Decode</label>
        <input type="radio" id="decode" v-model="mode" value="decode" />
    </div>

    <label for="outputField" class="text-lg mt-4 inline-block">Output:</label>
    <Textarea id="outputField" v-model="outputValue" disabled></Textarea>
</template>
