/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ConnectionsService {
  private baseUrl = process.env.USERS_SERVICE_URL;

  async sendRequest(targetUserId: string, headers: any) {
    return axios.post(
      `${this.baseUrl}/connections/request/${targetUserId}`,
      {},
      {
        headers,
        withCredentials: true,
      },
    );
  }

  async accept(connectionId: string, headers: any) {
    return axios.post(
      `${this.baseUrl}/connections/accept/${connectionId}`,
      {},
      {
        headers,
        withCredentials: true,
      },
    );
  }

  async reject(connectionId: string, headers: any) {
    return axios.post(
      `${this.baseUrl}/connections/reject/${connectionId}`,
      {},
      {
        headers,
        withCredentials: true,
      },
    );
  }
}
