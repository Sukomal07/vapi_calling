interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface TranscriptProps {
    transcript: string;
}

export default function LiveTranscript({ transcript }: TranscriptProps) {
    const parseTranscript = (transcript: string): Message[] => {
        const lines = transcript?.split('\n');
        const messages: Message[] = [
            {
                role: 'assistant',
                content: 'Hi, there how are you?'
            }
        ];

        lines?.forEach(line => {
            if (line.startsWith('User:')) {
                messages.push({
                    role: 'user',
                    content: line.slice(5).trim()
                });
            } else if (line.startsWith('AI:')) {
                messages.push({
                    role: 'assistant',
                    content: line.slice(3).trim()
                });
            } else if (messages.length > 0) {
                // Append to the last message if it's a continuation
                messages[messages.length - 1].content += ' ' + line.trim();
            }
        });

        return messages;
    };

    const conversation = parseTranscript(transcript);

    return (
        <div className="bg-gray-100 p-4 rounded-md mb-4">
            <h2 className="text-lg font-semibold mb-2">Conversation</h2>
            <div className="space-y-2">
                {conversation.map((message, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100 text-right' : 'bg-green-100'
                            }`}
                    >
                        <span className="font-bold">
                            {message.role === 'user' ? 'You' : 'Assistant'}:{' '}
                        </span>
                        {message.content}
                    </div>
                ))}
            </div>
        </div>
    );
}