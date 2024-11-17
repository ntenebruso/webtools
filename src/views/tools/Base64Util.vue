<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import Textarea from "../../components/ui/Textarea.vue";

const inputValue = ref("");
const webSafe = ref(false);
const mode = ref<"encode" | "decode">("encode");
const inputError = ref(false);
const outputValue = ref("");

function stringToBin(str: string) {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) =>
        String.fromCodePoint(byte)
    ).join("");
    return binString;
}

function binToString(str: string) {
    const bytes = Uint8Array.from(str, (m) => m.codePointAt(0)!);
    const decodedStr = new TextDecoder().decode(bytes);
    return decodedStr;
}

watchEffect(() => {
    inputError.value = false;
    try {
        if (mode.value == "encode") {
            const encoded = btoa(stringToBin(inputValue.value));
            if (!webSafe.value) {
                outputValue.value = encoded;
                return;
            }

            let final = encoded
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/\=+$/, "");
            outputValue.value = final;
            return;
        }

        if (mode.value == "decode") {
            const encoded = inputValue.value;
            let final = encoded.replace(/\=+$/, "");

            while (final.length % 4 != 0) {
                final += "=";
            }

            if (!webSafe.value) {
                outputValue.value = binToString(atob(encoded));
                return;
            }

            final = final.replace(/-/g, "+").replace(/_/g, "/");

            outputValue.value = binToString(atob(final));
            return;
        }
    } catch (e) {
        console.error(e);
        outputValue.value = "";
        inputError.value = true;
    }
});
</script>

<template>
    <h1 class="mt-4 text-4xl font-bold">Base64 Encoder and Decoder</h1>
    <label for="inputField" class="text-lg block mt-4">Input:</label>
    <Textarea
        v-model.lazy="inputValue"
        id="inputField"
        class="min-h-32"
    ></Textarea>

    <div class="mt-2 flex">
        <label for="webSafeInput">Web-Safe</label>
        <input
            type="checkbox"
            id="webSafeInput"
            checked="false"
            class="ml-1"
            v-model="webSafe"
        />

        <div class="flex-1"></div>

        <label for="encode">Encode</label>
        <input type="radio" id="encode" v-model="mode" value="encode" />
        <label for="decode" class="ml-2">Decode</label>
        <input type="radio" id="decode" v-model="mode" value="decode" />
    </div>

    <label for="outputField" class="text-lg block mt-4">Output:</label>
    <Textarea
        id="outputField"
        class="min-h-32"
        disabled
        v-model="outputValue"
    ></Textarea>
    <p class="text-red-500 text-lg" v-if="inputError">
        Input contains an error!
    </p>
</template>
