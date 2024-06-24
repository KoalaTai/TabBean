import io from 'socket.io-client';

class CommunicationModule {
  constructor() {
    this.socket = io('https://your-backend-server.com');
    this.setupListeners();
  }

  setupListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('message', (data) => {
      console.log('Received message:', data);
      // Handle incoming messages
    });
  }

  sendMessage(message, target) {
    this.socket.emit('sendMessage', { message, target });
  }

  joinRoom(room) {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(room) {
    this.socket.emit('leaveRoom', room);
  }
}

export default new CommunicationModule();
