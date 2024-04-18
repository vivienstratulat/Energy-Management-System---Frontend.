// messageListenerService.js
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';

class MessageListenerService {
    constructor() {
        this.stompClient = null;
    }

    connect(userId) {
        const socket = new SockJS('http://localhost:8091/chat');
        this.stompClient = Stomp.over(socket);
        this.stompClient.connect({}, () => {
            this.stompClient.subscribe(`/queue/${userId}`, message => {
                const receivedMessage = JSON.parse(message.body);
                // Trigger toast notification
                toast(`New message: ${receivedMessage.text}`, { autoClose: 6000 });
                // Optionally, update global state here
            });
        });
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect();
        }
    }
}

export const messageListener = new MessageListenerService();
