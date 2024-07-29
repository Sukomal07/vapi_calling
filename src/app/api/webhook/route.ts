import { VapiPayload } from "@/types/vapi.types";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest) {
    try {
        const payload = req.body.message as VapiPayload;
        console.log('type', payload);
        const response = await handler(payload);
        return NextResponse.json({ status: 201, response });
    } catch (error: any) {
        return NextResponse.json({ status: 500, message: error.message });
    }
};

export const handler = async (payload?: any): Promise<any> => {
    /**
     * Handle Business logic here.
     * Sent during a call whenever the transcript is available for certain chunk in the stream.
     * You can store the transcript in your database or have some other business logic.
     */
    try {
        // Example: Log the payload and perform a sample operation
        console.log('Handling payload:', payload);
        return { success: true, message: 'Payload processed successfully' };
    } catch (error: any) {
        console.error('Error in handler function:', error.message);
        throw new Error('Failed to process payload');
    }
};