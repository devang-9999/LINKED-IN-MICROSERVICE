/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProfileService {
  private baseUrl = process.env.USERS_SERVICE_URL;

  async getMyProfile(headers: any) {
    const response = await axios.get(`${this.baseUrl}/profile/me`, {
      headers,
      withCredentials: true,
    });

    return response;
  }

  async getPublicProfile(id: string, headers: any) {
    const response = await axios.get(`${this.baseUrl}/profile/${id}`, {
      headers,
      withCredentials: true,
    });

    return response;
  }

  async updateProfileJson(data: any, headers: any) {
    const response = await axios.patch(`${this.baseUrl}/profile/me`, data, {
      headers,
      withCredentials: true,
      timeout: 10000,
    });

    return response;
  }

  async getSuggestions(headers: any) {
    const cleanHeaders: any = {};

    if (headers.cookie) {
      cleanHeaders.cookie = headers.cookie;
    }

    const response = await axios.get(`${this.baseUrl}/profile/suggestions`, {
      headers: {
        ...cleanHeaders,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      withCredentials: true,
    });

    return response;
  }
}
