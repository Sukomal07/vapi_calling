interface CallStatusProps {
    status: string;
    endedReason?: string;
}

export default function CallStatus({ status, endedReason }: CallStatusProps) {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Call Status</h2>
            <p>Status: {status}</p>
            {endedReason && <p>Ended Reason: {endedReason}</p>}
        </div>
    );
}