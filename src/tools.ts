import { type Component } from "vue";

interface Tool {
    title: string;
    description?: string;
    path: string;
    component: Component;
}

export const tools: Tool[] = [
    {
        title: "Screen Recorder",
        description:
            "An online screen recorder, with microphone and voiceover support.",
        path: "/screen-recorder",
        component: () => import("./views/tools/ScreenRecorder.vue"),
    },
    {
        title: "Base64 Encoder/Decoder",
        description:
            "A utility that lets you quickly encode and decode Base64 strings",
        path: "/base64",
        component: () => import("./views/tools/Base64Util.vue"),
    },
];
