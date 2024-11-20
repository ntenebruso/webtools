<script setup lang="ts">
import { ref, useTemplateRef, onMounted, watchEffect } from "vue";
import Button from "../../components/ui/Button.vue";
import { RefreshCcwIcon } from "lucide-vue-next";

const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "123456789";
const symbols = ref("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");

const includeLowercase = ref(true);
const includeUppercase = ref(true);
const includeNumbers = ref(true);
const includeSymbols = ref(false);

const symbolsInput = useTemplateRef<HTMLInputElement>("symbolsInput");
const symbolsChanged = ref(false);

const length = ref(8);

const passwordOutput = useTemplateRef<HTMLInputElement>("passwordOutput");

function handleSymbolChange(e: any) {
    symbolsChanged.value = true;
    e.target.focus();
}

function updateSymbols() {
    symbolsChanged.value = false;
    symbols.value = symbolsInput.value!.value;
}

function generateRandomNum(min: number, max: number) {
    const rand =
        crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) + 1);

    return Math.floor(rand * (max - min + 1)) + min;
}

function generatePassword() {
    let values = "";

    if (includeLowercase.value == true) values += lowercase;
    if (includeUppercase.value == true) values += uppercase;
    if (includeNumbers.value == true) values += numbers;
    if (includeSymbols.value == true) values += symbols.value;

    let final = "";
    for (let i = 0; i < length.value; i++) {
        const randIndex = generateRandomNum(0, values.length - 1);
        final += values[randIndex];
    }

    if (passwordOutput.value) passwordOutput.value.value = final;
}

watchEffect(() => {
    generatePassword();
});

onMounted(() => {
    symbolsInput.value!.defaultValue = symbols.value;
});
</script>

<template>
    <h1 class="mt-4 text-4xl font-bold">Password Generator</h1>
    <label for="passwordOutput" class="block mt-4 text-lg">Password:</label>
    <div class="flex">
        <input
            id="passwordOutput"
            ref="passwordOutput"
            type="text"
            class="flex-1 bg-zinc-700 p-2 rounded-md border border-zinc-600 focus:ring-2 focus:ring-blue-500 outline-none w-full text-xl font-mono"
        />
        <Button
            class="ml-2 w-12 h-12 flex items-center justify-center"
            @click="generatePassword"
        >
            <RefreshCcwIcon />
        </Button>
    </div>

    <div class="mt-4">
        <p class="font-bold text-lg">Options</p>
        <div>
            <label for="length" class="block">Password length: </label>
            <input
                id="length"
                type="range"
                min="1"
                max="30"
                v-model="length"
                class="align-middle"
            />
            <span> {{ length }}</span>
        </div>
        <div>
            <label for="includeLowercase">Include lowercase letters: </label>
            <input
                type="checkbox"
                v-model="includeLowercase"
                id="includeLowercase"
            />
        </div>
        <div>
            <label for="includeUppercase">Include uppercase letters: </label>
            <input
                type="checkbox"
                v-model="includeUppercase"
                id="includeUppercase"
            />
        </div>
        <div>
            <label for="includeNumbers">Include numbers: </label>
            <input
                type="checkbox"
                v-model="includeNumbers"
                id="includeNumbers"
            />
        </div>
        <div>
            <label for="includeSymbols">Include symbols: </label>
            <input
                type="checkbox"
                v-model="includeSymbols"
                id="includeSymbols"
            />
            <input
                type="text"
                class="inline ml-2 bg-zinc-700 disabled:text-zinc-400 p-1 rounded-md border border-zinc-600 focus:ring-2 focus:ring-blue-500 outline-none w-full max-w-64 font-mono"
                :disabled="!includeSymbols"
                ref="symbolsInput"
                @input="handleSymbolChange"
            />
            <Button class="ml-2" v-if="symbolsChanged" @click="updateSymbols"
                >update symbols</Button
            >
        </div>
    </div>
</template>
