import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const config = {
            "assistant": {
                "transcriber": {
                    "provider": "deepgram",
                    "model": "nova-2",
                    "language": "en-US",
                    "smartFormat": false
                },
                "model": {
                    "messages": [
                        {
                            "role": "assistant",
                            "content": "You are part of the sales team for a mobile company. Your role is to approach customers to buy a new phone ."
                        }
                    ],
                    "tools": [
                        {
                            "async": false,
                            "type": "function",
                            "function": {
                                "name": "getCustomerAnswer",
                                "description": "This tool collects the customer's answer is they want to buy or not .",
                                "parameters": {
                                    "type": "object",
                                    "properties": {
                                        "customerIssue": {
                                            "type": "string",
                                            "description": "The phone want to buy customer"
                                        }
                                    }
                                }
                            }
                        }
                    ],
                    "provider": "openai",
                    "model": "gpt-4o",
                    "temperature": 1,
                    "maxTokens": 250,
                    "emotionRecognitionEnabled": true
                },
                "voice": {
                    "inputPreprocessingEnabled": true,
                    "inputReformattingEnabled": true,
                    "inputMinCharacters": 10,
                    "fillerInjectionEnabled": false,
                    "provider": "11labs",
                    "voiceId": "joseph",
                    "stability": 0.5,
                    "similarityBoost": 0.75,
                    "style": 0,
                    "useSpeakerBoost": true,
                    "enableSsmlParsing": false,
                    "model": "eleven_turbo_v2",
                    "optimizeStreamingLatency": 4
                },
                "firstMessageMode": "assistant-speaks-first",
                "firstMessage": "Hi, there how are you ?",
                "recordingEnabled": true,
                "silenceTimeoutSeconds": 30,
                "responseDelaySeconds": 0.1,
                "llmRequestDelaySeconds": 0.1,
                "numWordsToInterruptAssistant": 3,
                "maxDurationSeconds": 1799,
                "llmRequestNonPunctuatedDelaySeconds": 0.1,
                "backgroundSound": "office",
                "backchannelingEnabled": true,
                "backgroundDenoisingEnabled": true
            },
            "phoneNumberId": "phoneNumberId",
            "phoneNumber": {
                "twilioPhoneNumber": "+15107616995",
                "twilioAccountSid": "twillo twilioAccountSid",
                "twilioAuthToken": "twilioAuthToken"
            },
            "customer": {
                "number": "customer phone no",
                "name": "customer name"
            }
        }
        const response = await fetch('https://api.vapi.ai/call', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <Your token>'
            },
            body: JSON.stringify(config)
        })
        const data = await response.json();
        return NextResponse.json({ message: "Successfully called", callId: data.id })
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const callId = request.nextUrl.searchParams.get('callId');

    if (!callId) {
        return NextResponse.json({ message: "Call ID is required" }, { status: 400 });
    }

    const stream = new ReadableStream({
        async start(controller) {
            const intervalId = setInterval(async () => {
                try {
                    const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
                        headers: {
                            'Authorization': 'Bearer <your token>'
                        }
                    });
                    const data = await response.json();
                    console.log(data)
                    controller.enqueue(`data: ${JSON.stringify({
                        status: data.status,
                        transcript: data.transcript,
                        endedReason: data.endedReason
                    })}\n\n`);

                    if (data.status === 'ended') {
                        clearInterval(intervalId);
                        controller.close();
                    }
                } catch (error) {
                    console.error('Error fetching call status:', error);
                }
            }, 1000); // Poll every second

            // Clean up the interval when the connection is closed
            request.signal.addEventListener('abort', () => {
                clearInterval(intervalId);
                controller.close();
            });
        }
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}