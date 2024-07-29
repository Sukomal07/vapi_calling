
export const VAPI_CALL_STATUSES = [
    "queued",
    "ringing",
    "in-progress",
    "forwarding",
    "ended",
] as const;
export type VapiCallStatus = (typeof VAPI_CALL_STATUSES)[number];

export enum VapiWebhookEnum {
    ASSISTANT_REQUEST = "assistant-request",
    FUNCTION_CALL = "function-call",
    STATUS_UPDATE = "status-update",
    END_OF_CALL_REPORT = "end-of-call-report",
    HANG = "hang",
    SPEECH_UPDATE = "speech-update",
    TRANSCRIPT = "transcript",
}

export interface ConversationMessage {
    role: "user" | "system" | "bot" | "function_call" | "function_result";
    message?: string;
    name?: string;
    args?: string;
    result?: string;
    time: number;
    endTime?: number;
    secondsFromStart: number;
}

interface BaseVapiPayload {
    call: VapiCall;
}

export interface AssistantRequestPayload extends BaseVapiPayload {
    type: VapiWebhookEnum.ASSISTANT_REQUEST;
}

export interface StatusUpdatePayload extends BaseVapiPayload {
    type: VapiWebhookEnum.STATUS_UPDATE;
    status: VapiCallStatus;
    messages?: any;
}

export interface FunctionCallPayload extends BaseVapiPayload {
    type: VapiWebhookEnum.FUNCTION_CALL;
    functionCall: any;
}

export interface EndOfCallReportPayload extends BaseVapiPayload {
    type: VapiWebhookEnum.END_OF_CALL_REPORT;
    endedReason: string;
    transcript: string;
    messages: ConversationMessage[];
    summary: string;
    recordingUrl?: string;
}

export interface HangPayload extends BaseVapiPayload {
    type: VapiWebhookEnum.HANG;
}

export interface SpeechUpdatePayload extends BaseVapiPayload {
    type: VapiWebhookEnum.SPEECH_UPDATE;
    status: "started" | "stopped";
    role: "assistant" | "user";
}

export interface TranscriptPayload {
    type: VapiWebhookEnum.TRANSCRIPT;
    role: "assistant" | "user";
    transcriptType: "partial" | "final";
    transcript: string;
}

export interface VapiCall { }
export type VapiPayload =
    | AssistantRequestPayload
    | StatusUpdatePayload
    | FunctionCallPayload
    | EndOfCallReportPayload
    | SpeechUpdatePayload
    | TranscriptPayload
    | HangPayload;

export type FunctionCallMessageResponse =
    | {
        result: string;
    }
    | any;

export interface AssistantRequestMessageResponse {
    assistant?: any;
    error?: string;
}

export interface StatusUpdateMessageResponse { }
export interface SpeechUpdateMessageResponse { }
export interface TranscriptMessageResponse { }
export interface HangMessageResponse { }
export interface EndOfCallReportMessageResponse { }

export type VapiResponse =
    | AssistantRequestMessageResponse
    | FunctionCallMessageResponse
    | EndOfCallReportMessageResponse
    | HangMessageResponse
    | StatusUpdateMessageResponse
    | SpeechUpdateMessageResponse
    | TranscriptMessageResponse;