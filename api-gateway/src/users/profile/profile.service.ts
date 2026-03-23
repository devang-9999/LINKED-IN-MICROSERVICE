/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProfileService {
  private baseUrl = process.env.USERS_SERVICE_URL;

  // async getMyProfile(headers: any) {
  //   const response = await axios.get(`${this.baseUrl}/profile/me`, {
  //     headers,
  //     withCredentials: true,
  //   });

  //   return response;
  // }

  async getMyProfile(headers: any) {
    try {
      const cleanHeaders: any = {};

      if (headers.cookie) {
        cleanHeaders.cookie = headers.cookie;
      }

      // Optional: forward auth header if present
      if (headers.authorization) {
        cleanHeaders.authorization = headers.authorization;
      }

      const response = await axios.get(`${this.baseUrl}/profile/me`, {
        headers: cleanHeaders,
        withCredentials: true,
        timeout: 5000,
      });

      return response;
    } catch (error: any) {
      console.error(
        ' ProfileService.getMyProfile error:',
        error?.response?.data || error.message,
      );

      throw error; // important → controller will handle it
    }
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
