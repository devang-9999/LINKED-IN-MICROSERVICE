/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FollowersService {
  private baseUrl = process.env.USERS_SERVICE_URL;

  async follow(userId: string, headers: any) {
    try {
      const cleanHeaders: any = {};

      if (headers.authorization) {
        cleanHeaders.authorization = headers.authorization;
      }

      if (headers.cookie) {
        cleanHeaders.cookie = headers.cookie;
      }

      const res = await axios.post(
        `${this.baseUrl}/followers/${userId}`,
        {},
        {
          headers: cleanHeaders,
          withCredentials: true,
        },
      );

      return res.data;
    } catch (error: any) {
      console.error('FOLLOW ERROR:', error?.response?.data);
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async unfollow(userId: string, headers: any) {
    return axios.delete(`${this.baseUrl}/followers/${userId}`, {
      headers,
      withCredentials: true,
    });
  }

  async getFollowers(userId: string, headers: any) {
    return axios.get(`${this.baseUrl}/followers/${userId}`, {
      headers,
      withCredentials: true,
    });
  }

  async getFollowing(userId: string, headers: any) {
    return axios.get(`${this.baseUrl}/followers/following/${userId}`, {
      headers,
      withCredentials: true,
    });
  }

  async getFollowStatus(userId: string, headers: any) {
    return axios.get(`${this.baseUrl}/followers/status/${userId}`, {
      headers,
      withCredentials: true,
    });
  }
}
