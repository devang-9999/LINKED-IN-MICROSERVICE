/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  // store active users (optional but useful)
  private userSocketMap = new Map<string, string[]>();

  // USER CONNECTED
  async handleConnection(client: Socket) {
    try {
      const token = await client.handshake.auth?.token;

      if (!token) {
        client.disconnect();
        return;
      }

      // 🔐 verify JWT
      const payload = this.jwtService.verify(token);
      const userId = payload.userId;

      // join user room
      client.join(userId);

      // store socket
      const existingSockets = this.userSocketMap.get(userId) || [];
      existingSockets.push(client.id);
      this.userSocketMap.set(userId, existingSockets);

      console.log(`✅ User ${userId} connected`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSocketMap.entries()) {
      const updatedSockets = sockets.filter((id) => id !== client.id);

      if (updatedSockets.length === 0) {
        this.userSocketMap.delete(userId);
      } else {
        this.userSocketMap.set(userId, updatedSockets);
      }
    }

    console.log(`❌ Socket ${client.id} disconnected`);
  }

  sendNotification(userId: string, payload: any) {
    this.server.to(userId).emit('notification', payload);
  }

  sendUnreadCount(userId: string, count: number) {
    this.server.to(userId).emit('notification-count', {
      unreadCount: count,
    });
  }
}
