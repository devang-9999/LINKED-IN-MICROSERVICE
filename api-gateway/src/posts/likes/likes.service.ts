/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LikesService {
  private baseUrl = process.env.POSTS_SERVICE_URL;

  async toggleLike(body: any, headers: any) {
    const response = await axios.post(`${this.baseUrl}/likes`, body, {
      headers,
      withCredentials: true,
    });

    return response;
  }

  async getLikes(postId: string, headers: any) {
    const response = await axios.get(`${this.baseUrl}/likes/${postId}`, {
      headers,
      withCredentials: true,
    });

    return response;
  }
}
