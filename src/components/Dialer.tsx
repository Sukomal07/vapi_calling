"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"

interface DialerProps {
  onCallInitiated: (callId: string) => void;
  onCallEnded: (callData: any) => void;
  onStatusUpdate: (status: string) => void;
}

export default function Dialer({ onCallInitiated, onCallEnded, onStatusUpdate }: DialerProps) {
  const [isCallInProgress, setIsCallInProgress] = useState(false)
  const [callId, setCallId] = useState<string | null>(null)

  const initiateCall = async () => {
    try {
      setIsCallInProgress(true)
      const response = await fetch('/api/call', { method: 'POST' });
      const data = await response.json();
      setCallId(data.callId);
      onCallInitiated(data.callId);
    } catch (error) {
      console.error('Failed to initiate call:', error)
    }
  }

  useEffect(() => {
    if (callId) {
      const eventSource = new EventSource(`/api/call?callId=${callId}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status) {
          onStatusUpdate(data.status);
        }
        if (data.status === 'ended') {
          eventSource.close();
          setIsCallInProgress(false)
          onCallEnded(data);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [callId]);

  return (
    <div className="mb-4 space-x-2">
      <Button onClick={initiateCall} disabled={isCallInProgress}>
        {isCallInProgress ? 'Call in Progress' : 'Make Call'}
      </Button>
      {/* {isCallInProgress && (
        <Button onClick={() => endCall('user-ended')} variant="destructive">
          End Call
        </Button>
      )} */}
    </div>
  )
}