/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

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
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      console.log('🔌 Incoming socket...');

      const cookie = client.handshake.headers.cookie;

      if (!cookie) {
        console.log('❌ No cookie found');
        client.disconnect();
        return;
      }

      const token = cookie
        .split(';')
        .find((c) => c.trim().startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        console.log('❌ No token in cookie');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);

      const userId = payload.sub;

      if (!userId) {
        console.log('❌ Invalid token payload');
        client.disconnect();
        return;
      }

      await client.join(userId);

      console.log(`✅ User ${userId} connected (socket: ${client.id})`);
    } catch (err) {
      console.log('❌ Socket auth error:', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Socket disconnected: ${client.id}`);
  }

  sendNotification(userId: string, payload: any) {
    if (!userId) return;
    this.server.to(userId).emit('notification', payload);
    console.log(`📨 Notification sent to ${userId}`);
  }

  sendUnreadCount(userId: string, count: number) {
    if (!userId) return;

    this.server.to(userId).emit('notification-count', {
      unreadCount: count,
    });

    console.log(`🔔 Count updated for ${userId}: ${count}`);
  }
}
