import { createServer } from 'http';
import express from 'express';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = createServer(server);

    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        const sendMessage = () => {
            const message = `Hello from the server! Time: ${new Date().toLocaleTimeString()}`;
            socket.emit('messageFromServer', { message });
        };

        const interval = setInterval(sendMessage, 1000);

        socket.on('startCall', async () => {
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
                        Authorization: `Bearer ${process.env.VAPI_BEARER_TOKEN}`,
                    },
                    body: JSON.stringify(config),
                });

                const data = await response.json();
                socket.emit('createCall', data);
            } catch (error) {
                console.error('Error fetching data:', error);
                socket.emit('createCall', { error: 'Failed to fetch data' });
            }
        });

        socket.on('duringCall', async () => {
            try {
                const res = await fetch('http://localhost:3000/api/webhook', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const data = await res.json();
                socket.emit('getMessage', data);
            } catch (error) {
                console.error('Error fetching message:', error);
                socket.emit('getMessage', { error: 'Failed to fetch message' });
            }
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            clearInterval(interval);
        });
    });

    server.all('*', (req, res) => {
        return handler(req, res);
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
