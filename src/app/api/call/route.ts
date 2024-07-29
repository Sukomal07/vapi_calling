import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const config = {
            assistantId: process.env.ASSISTANT_ID,
            phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
            customer: {
                number: process.env.CUSTOMER_PHONE_NUMBER,
                name: 'Sukomal',
            },
        };
        const response = await fetch('https://api.vapi.ai/call', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.VAPI_BEARER_TOKEN}`
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
                            'Authorization': `Bearer ${process.env.VAPI_BEARER_TOKEN}`
                        }
                    });
                    const data = await response.json();
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