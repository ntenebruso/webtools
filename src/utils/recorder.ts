// export interface ScreenRecorderOptions {
//     micAudio: boolean;
// }
type Handler<E> = (event: E) => void;

class EventDispatcher<E> {
    private handlers: Handler<E>[] = [];

    public fire(event: E) {
        for (let h of this.handlers) {
            h(event);
        }
    }

    public register(handler: Handler<E>) {
        this.handlers.push(handler);
    }
}

interface RecordingStartedEvent {
    screenCaptureStream: MediaStream;
    audioCaptureStream?: MediaStream | null;
    mediaStream: MediaStream;
}
interface RecordingStoppedEvent {
    recordingBlob: Blob;
}

export class ScreenRecorder {
    private currentlyRecording: boolean = false;
    private mediaRecorder?: MediaRecorder | null;
    private mediaStream?: MediaStream | null;
    private mediaTracks: MediaStreamTrack[] = [];
    private screenCaptureStream?: MediaStream | null;
    private audioCaptureStream?: MediaStream | null;
    private chunks: BlobEvent["data"][] = [];
    private availableMics?: MediaDeviceInfo[] | null;
    private microphone?: MediaDeviceInfo | null;
    private recordingBlob?: Blob | null;

    private recordingStartedDispatcher =
        new EventDispatcher<RecordingStartedEvent>();
    private recordingStoppedDispatcher =
        new EventDispatcher<RecordingStoppedEvent>();

    public async loadMics() {
        await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        });

        const devices = await navigator.mediaDevices.enumerateDevices();
        this.availableMics = devices.filter(
            (device) => device.kind == "audioinput"
        );
    }

    public async getAvailableMics() {
        if (!this.availableMics) {
            await this.loadMics();
        }

        return this.availableMics!;
    }

    public async selectMic(micId: string | null) {
        if (this.currentlyRecording)
            throw new Error("Recording is currently in progress.");

        if (micId === null) {
            this.microphone = null;
            return;
        }

        if (!this.availableMics) {
            await this.loadMics();
        }

        const microphone = this.availableMics!.find(
            (mic) => mic.deviceId == micId
        );

        if (!microphone) {
            throw new Error(`No microphone with ID ${micId} found.`);
        }

        this.microphone = microphone;
    }

    public async startRecording() {
        if (this.currentlyRecording)
            throw new Error("Recording is currently in progress.");

        try {
            if (this.microphone) {
                this.audioCaptureStream =
                    await navigator.mediaDevices.getUserMedia({
                        video: false,
                        audio: {
                            deviceId: this.microphone.deviceId,
                        },
                    });
                this.mediaTracks.push(
                    ...this.audioCaptureStream.getAudioTracks()
                );
            }

            this.screenCaptureStream =
                await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true,
                });
            this.mediaTracks.push(...this.screenCaptureStream.getVideoTracks());
        } catch (e) {
            console.error("Error while creating media tracks", e);
            this._destroy();
            return;
        }

        this.mediaStream = new MediaStream(this.mediaTracks);
        this.mediaRecorder = new MediaRecorder(this.mediaStream, {
            mimeType: `video/webm; codecs=vp8${this.microphone ? ",opus" : ""}`,
        });

        this.mediaRecorder.addEventListener("dataavailable", (e) => {
            this.chunks.push(e.data);
        });

        this.mediaRecorder.addEventListener("start", () => {
            this.currentlyRecording = true;
            this.recordingStartedDispatcher.fire({
                mediaStream: this.mediaStream!,
                screenCaptureStream: this.screenCaptureStream!,
                audioCaptureStream: this.audioCaptureStream,
            });
        });

        this.mediaRecorder.addEventListener("stop", () => {
            this.currentlyRecording = false;
            this.recordingBlob = new Blob(this.chunks, { type: "video/webm" });
            this.recordingStoppedDispatcher.fire({
                recordingBlob: this.recordingBlob,
            });
            this._destroy();
        });

        this.mediaRecorder.start();
    }

    public onRecordingStart(handler: Handler<RecordingStartedEvent>) {
        this.recordingStartedDispatcher.register(handler);
    }

    public async stopRecording() {
        if (!this.currentlyRecording || !this.mediaRecorder)
            throw new Error("A recording has not been started yet.");

        this.mediaRecorder.stop();
    }

    public onRecordingStop(handler: Handler<RecordingStoppedEvent>) {
        this.recordingStoppedDispatcher.register(handler);
    }

    private async _destroy() {
        this.mediaRecorder = null;
        this.mediaStream = null;
        this.mediaTracks = [];
        this.screenCaptureStream = null;
        this.audioCaptureStream = null;
        this.chunks = [];
        this.recordingBlob = null;
    }
}
