<script setup lang="ts">
import { ref, useTemplateRef, watch, watchEffect } from "vue";

const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "123456789";
const symbols = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

const includeLowercase = ref(true);
const includeUppercase = ref(true);
const includeNumbers = ref(true);
const includeSymbols = ref(false);

const length = ref(8);

const passwordOutput = useTemplateRef<HTMLInputElement>("passwordOutput");

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
    if (includeSymbols.value == true) values += symbols;

    let final = "";

    for (let i = 0; i < length.value; i++) {
        const randIndex = generateRandomNum(0, values.length);
        console.log(randIndex, values.length);
        final += values[randIndex];
    }

    if (passwordOutput.value) passwordOutput.value.value = final;
}

watchEffect(() => {
    generatePassword();
});
</script>

<template>
    <h1 class="mt-4 text-4xl font-bold">Password Generator</h1>
    <label for="passwordOutput" class="block mt-4 text-lg">Password:</label>
    <input
        id="passwordOutput"
        ref="passwordOutput"
        type="text"
        class="block bg-zinc-700 p-2 rounded-md border border-zinc-600 focus:ring-2 focus:ring-blue-500 outline-none w-full text-xl font-mono"
    />

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
        </div>
    </div>
</template>
