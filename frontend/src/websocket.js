import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io('http://localhost:5000', {
      auth: { token },
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    this.socket.on('graphUpdate', (data) => {
      // Handle real-time graph updates
      store.dispatch(updateGraph(data));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new WebSocketService();