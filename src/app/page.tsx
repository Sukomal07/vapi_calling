"use client";

import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true)
    });

    socket.on('messageFromServer', (data) => {
      setMessage(data.message);
    });

    socket.on('dataFetched', (apiData) => {
      setData(apiData);
      console.log('Data fetched from server:', apiData);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false)
    });

    return () => {
      socket.off('connect');
      socket.off('messageFromServer');
      socket.off('dataFetched');
      socket.off('disconnect');
    };
  }, []);

  const fetchData = () => {
    if (isConnected) {
      socket.emit('startCall');
    } else {
      console.log('Not connected to the server');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-2">
      <Button variant={'default'} onClick={fetchData}>Make a call</Button>
      <p>Message: {message}</p>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
