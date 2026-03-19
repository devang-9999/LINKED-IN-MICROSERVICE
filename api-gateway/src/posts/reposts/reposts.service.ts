/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RepostsService {
  private baseUrl = process.env.POSTS_SERVICE_URL;

  async createRepost(postId: string, body: any, headers: any) {
    const response = await axios.post(
      `${this.baseUrl}/reposts/${postId}`,
      body,
      {
        headers,
        withCredentials: true,
      },
    );

    return response;
  }

  async getAllReposts(page: number, limit: number, headers: any) {
    const response = await axios.get(
      `${this.baseUrl}/reposts?page=${page}&limit=${limit}`,
      {
        headers,
        withCredentials: true,
      },
    );

    return response;
  }

  async getRepostsByPost(
    postId: string,
    page: number,
    limit: number,
    headers: any,
  ) {
    const response = await axios.get(
      `${this.baseUrl}/reposts/post/${postId}?page=${page}&limit=${limit}`,
      {
        headers,
        withCredentials: true,
      },
    );

    return response;
  }

  async deleteRepost(postId: string, headers: any) {
    const response = await axios.delete(`${this.baseUrl}/reposts/${postId}`, {
      headers,
      withCredentials: true,
    });

    return response;
  }
}
