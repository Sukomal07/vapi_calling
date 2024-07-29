import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

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
                socket.emit('dataFetched', data);
            } catch (error) {
                console.error('Error fetching data:', error);
                socket.emit('dataFetched', { error: 'Failed to fetch data' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
