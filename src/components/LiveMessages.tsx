import React from 'react';

interface Message {
    role: 'user' | 'bot' | 'tool_calls' | 'tool_call_result';
    time: number;
    endTime?: number;
    message: string;
    secondsFromStart: number;
    duration?: number;
    toolCalls?: any[];
    result?: string;
    toolCallId?: string;
}

interface LiveMessagesProps {
    messages: Message[];
}

export default function LiveMessages({ messages }: LiveMessagesProps) {
    return (
        <div className="bg-gray-100 p-4 rounded-md mb-4">
            <h2 className="text-lg font-semibold mb-2">Live Messages</h2>
            <div className="space-y-2">
                {messages.map((message, index) => (
                    <div key={index} className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100 text-right' : 'bg-green-100'}`}>
                        <span className="font-bold">{message.role}: </span>
                        {message.message}
                        <span className="text-xs block">{new Date(message.time).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
