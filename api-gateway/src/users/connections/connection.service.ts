/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ConnectionsService {
  private baseUrl = process.env.USERS_SERVICE_URL;

  async sendRequest(targetUserId: string, headers: any) {
    const cleanHeaders: any = {};

    if (headers.authorization) {
      cleanHeaders.authorization = headers.authorization;
    }

    if (headers.cookie) {
      cleanHeaders.cookie = headers.cookie;
    }

    return axios.post(
      `${this.baseUrl}/connections/request/${targetUserId}`,
      {},
      {
        headers: cleanHeaders,
        withCredentials: true,
      },
    );
  }

  async accept(connectionId: string, headers: any) {
    const cleanHeaders: any = {};

    if (headers.authorization) {
      cleanHeaders.authorization = headers.authorization;
    }

    if (headers.cookie) {
      cleanHeaders.cookie = headers.cookie;
    }

    return axios.post(
      `${this.baseUrl}/connections/accept/${connectionId}`,
      {},
      {
        headers: cleanHeaders,
        withCredentials: true,
      },
    );
  }
  async reject(connectionId: string, headers: any) {
    const cleanHeaders: any = {};

    if (headers.authorization) {
      cleanHeaders.authorization = headers.authorization;
    }

    if (headers.cookie) {
      cleanHeaders.cookie = headers.cookie;
    }

    return axios.post(
      `${this.baseUrl}/connections/reject/${connectionId}`,
      {},
      {
        headers: cleanHeaders,
        withCredentials: true,
      },
    );
  }
  async cancelRequest(userId: string, headers: any) {
    const cleanHeaders: any = {};

    if (headers.authorization) {
      cleanHeaders.authorization = headers.authorization;
    }

    if (headers.cookie) {
      cleanHeaders.cookie = headers.cookie;
    }

    return axios.delete(`${this.baseUrl}/connections/request/${userId}`, {
      headers: cleanHeaders,
      withCredentials: true,
    });
  }

  async getConnectionStatus(userId: string, headers: any) {
    const cleanHeaders: any = {};

    if (headers.authorization)
      cleanHeaders.authorization = headers.authorization;
    if (headers.cookie) cleanHeaders.cookie = headers.cookie;

    return axios.get(`${this.baseUrl}/connections/status/${userId}`, {
      headers: cleanHeaders,
      withCredentials: true,
    });
  }

  async getReceivedRequests(headers: any) {
    const cleanHeaders: any = {};

    if (headers.authorization)
      cleanHeaders.authorization = headers.authorization;
    if (headers.cookie) cleanHeaders.cookie = headers.cookie;

    return axios.get(`${this.baseUrl}/connections/requests`, {
      headers: cleanHeaders,
      withCredentials: true,
    });
  }

  async getSentRequests(headers: any) {
    const cleanHeaders: any = {};

    if (headers.authorization)
      cleanHeaders.authorization = headers.authorization;
    if (headers.cookie) cleanHeaders.cookie = headers.cookie;

    return axios.get(`${this.baseUrl}/connections/sent`, {
      headers: cleanHeaders,
      withCredentials: true,
    });
  }
}
