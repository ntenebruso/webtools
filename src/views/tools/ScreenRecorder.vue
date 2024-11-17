<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from "vue";
import Button from "../../components/ui/Button.vue";
import Select from "../../components/ui/Select.vue";
import { ScreenRecorder } from "../../utils/recorder";

const videoPreview = useTemplateRef<HTMLVideoElement>("videoPreview");
const recorder = new ScreenRecorder();
const recordingStarted = ref(false);
const mics = ref<MediaDeviceInfo[]>([]);
const finalVideoURL = ref<string | null>(null);

onMounted(async () => {
    mics.value = await recorder.getAvailableMics();
});

recorder.onRecordingStart((e) => {
    recordingStarted.value = true;
    finalVideoURL.value = null;
    videoPreview.value!.srcObject = e.screenCaptureStream;
});

recorder.onRecordingStop((e) => {
    recordingStarted.value = false;
    videoPreview.value!.srcObject = null;
    const blobURL = URL.createObjectURL(e.recordingBlob);
    finalVideoURL.value = blobURL;
});

function onMicSelected(e: Event) {
    const el = <HTMLSelectElement>e.target;
    if (el.value == "disablemic") recorder.selectMic(null);
    else recorder.selectMic(el.value);
}

const start = () => recorder.startRecording();
const stop = () => recorder.stopRecording();
</script>

<template>
    <h1 class="mt-4 text-4xl font-bold">Online Screen Recorder</h1>
    <video
        class="aspect-video w-full"
        ref="videoPreview"
        autoplay
        :src="finalVideoURL || ''"
        :controls="finalVideoURL ? true : false"
    ></video>
    <div class="flex gap-x-2 mt-4">
        <Button :disabled="recordingStarted" @click="start"
            >Start recording</Button
        >
        <Button :disabled="!recordingStarted" @click="stop"
            >Stop recording</Button
        >
        <div class="flex-1"></div>
        <a
            v-if="finalVideoURL"
            :href="finalVideoURL"
            download="screenrecording.webm"
            class="text-blue-500 hover:underline"
            >Download</a
        >
    </div>
    <hr class="border-0 h-px bg-zinc-700 my-4" />
    <label for="micSelect">Microphone:</label>
    <Select id="micSelect" :disabled="recordingStarted" @change="onMicSelected">
        <option value="disablemic">No Mic</option>
        <option v-for="mic in mics" :value="mic.deviceId">
            {{ mic.label }}
        </option>
    </Select>
</template>
