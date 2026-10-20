import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = {};
  }

  connect(onConnected, onError) {
    if (this.client && this.client.active) {
      if (onConnected) onConnected();
      return;
    }

    const socketUrl = window.location.port === '5173' ? 'http://localhost:8080/ws' : '/ws';

    this.client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        // console.debug('[STOMP]', str);
      },
      onConnect: () => {
        this.connected = true;
        if (onConnected) onConnected();
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        if (onError) onError(frame);
      },
      onWebSocketClose: () => {
        this.connected = false;
      }
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      this.subscriptions = {};
    }
  }

  subscribe(destination, callback) {
    if (!this.client || !this.connected) {
      console.warn('Cannot subscribe yet, STOMP not connected');
      return null;
    }
    const sub = this.client.subscribe(destination, (message) => {
      try {
        const payload = JSON.parse(message.body);
        callback(payload);
      } catch (e) {
        callback(message.body);
      }
    });
    this.subscriptions[destination] = sub;
    return sub;
  }

  unsubscribe(destination) {
    if (this.subscriptions[destination]) {
      this.subscriptions[destination].unsubscribe();
      delete this.subscriptions[destination];
    }
  }

  publish(destination, body) {
    if (!this.client || !this.connected) {
      return;
    }
    this.client.publish({
      destination,
      body: JSON.stringify(body)
    });
  }
}

export const wsService = new WebSocketService();
