/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FollowersService {
  private baseUrl = process.env.USERS_SERVICE_URL;

  async follow(userId: string, headers: any) {
    return axios.post(
      `${this.baseUrl}/followers/${userId}`,
      {},
      {
        headers,
        withCredentials: true,
      },
    );
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
