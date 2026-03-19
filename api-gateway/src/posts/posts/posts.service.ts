/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PostsService {
  private baseUrl = process.env.POSTS_SERVICE_URL;

  async getAllPosts(headers: any) {
    const response = await axios.get(`${this.baseUrl}/posts`, {
      headers,
      withCredentials: true,
    });

    return response;
  }

  async getPost(id: string, headers: any) {
    const response = await axios.get(`${this.baseUrl}/posts/${id}`, {
      headers,
      withCredentials: true,
    });

    return response;
  }

  async deletePost(id: string, headers: any) {
    const response = await axios.delete(`${this.baseUrl}/posts/${id}`, {
      headers,
      withCredentials: true,
    });

    return response;
  }
}
