/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class InteractionsService {
  private baseUrl = process.env.POSTS_SERVICE_URL;

  async createComment(body: any, headers: any) {
    return axios.post(`${this.baseUrl}/comments`, body, {
      headers,
      withCredentials: true,
    });
  }

  async getComments(postId: string, page: number, limit: number, headers: any) {
    return axios.get(
      `${this.baseUrl}/comments/${postId}?page=${page}&limit=${limit}`,
      {
        headers,
        withCredentials: true,
      },
    );
  }

  async getReplies(
    commentId: string,
    page: number,
    limit: number,
    headers: any,
  ) {
    return axios.get(
      `${this.baseUrl}/comments/replies/${commentId}?page=${page}&limit=${limit}`,
      {
        headers,
        withCredentials: true,
      },
    );
  }

  async deleteComment(commentId: string, headers: any) {
    return axios.delete(`${this.baseUrl}/comments/${commentId}`, {
      headers,
      withCredentials: true,
    });
  }

  async toggleCommentLike(body: any, headers: any) {
    return axios.post(`${this.baseUrl}/comment-likes`, body, {
      headers,
      withCredentials: true,
    });
  }

  async getCommentLikes(commentId: string, headers: any) {
    return axios.get(`${this.baseUrl}/comment-likes/${commentId}`, {
      headers,
      withCredentials: true,
    });
  }
}
