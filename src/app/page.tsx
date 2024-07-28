"use client"
import { useState } from 'react'
import Dialer from '../components/Dialer'
import LiveMessages from '../components/LiveMessages'
import Transcript from '../components/LiveTranscript'
import CallStatus from '../components/CallStatus'

export default function Home() {
  const [callActive, setCallActive] = useState(false)
  const [callData, setCallData] = useState<any>(null)
  const [callStatus, setCallStatus] = useState('')


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Phone Call App</h1>
      <Dialer
        onCallInitiated={(callId) => setCallActive(true)}
        onCallEnded={(data) => {
          setCallActive(false)
          setCallData(data)
          setCallStatus('ended')
        }}
        onStatusUpdate={setCallStatus}
      />
      <CallStatus status={callStatus} endedReason={callData?.endedReason} />
      {!callActive && callData && (
        <Transcript transcript={callData.transcript} />
      )}
    </div>
  )
}