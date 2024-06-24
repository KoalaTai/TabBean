import io from 'socket.io-client';
import config from '../config';

class CommunicationModule {
  constructor() {
    this.socket = io(config.backendUrl);
    this.setupListeners();
  }

  setupListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('message', (data) => {
      console.log('Received message:', data);
      // Dispatch message to appropriate handler
      this.handleIncomingMessage(data);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  handleIncomingMessage(data) {
    // TODO: Implement message handling logic
    // This could involve updating UI, storing data, or triggering other actions
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
