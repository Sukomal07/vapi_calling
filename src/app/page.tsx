"use client";

import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');
  const [data, setData] = useState(null);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('dataFetched', (apiData) => {
      setData(apiData);
      console.log('Data fetched from server:', apiData);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('dataFetched');
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
    <div className="container mx-auto p-4">
      <Button variant={'default'} onClick={fetchData}>Make a call</Button>
      <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
      <p>Transport: {transport}</p>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
