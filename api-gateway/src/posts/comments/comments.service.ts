/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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

  // async getComments(postId: string, page: number, limit: number, headers: any) {
  //   return axios.get(
  //     `${this.baseUrl}/comments/${postId}?page=${page}&limit=${limit}`,
  //     {
  //       headers,
  //       withCredentials: true,
  //     },
  //   );
  // }

  async getComments(postId: string, page: number, limit: number, headers: any) {
    const cookie = headers.cookie;

    // 1. get comments
    const response = await axios.get(
      `${this.baseUrl}/comments/${postId}?page=${page}&limit=${limit}`,
      {
        headers,
        withCredentials: true,
      },
    );

    const data = response.data;
    const comments = data.comments || [];

    if (!comments.length) {
      return response;
    }

    const userIds = [
      ...new Set(comments.map((c: any) => c.userId).filter(Boolean)),
    ];

    let users: any[] = [];

    // 3. fetch users
    if (userIds.length > 0) {
      const usersRes = await axios.get(
        `http://users-service:3002/profile/bulk`,
        {
          params: { ids: userIds.join(',') },
          headers: { cookie },
        },
      );

      users = usersRes.data || [];
    }

    const userMap = new Map(users.map((u: any) => [u.id, u]));

    const enrichedComments = comments.map((c: any) => ({
      ...c,
      user: userMap.get(c.userId) || null,
    }));

    // 5. return updated response
    return {
      ...response,
      data: {
        ...data,
        comments: enrichedComments,
      },
    };
  }

  // async getReplies(
  //   commentId: string,
  //   page: number,
  //   limit: number,
  //   headers: any,
  // ) {
  //   return axios.get(
  //     `${this.baseUrl}/comments/replies/${commentId}?page=${page}&limit=${limit}`,
  //     {
  //       headers,
  //       withCredentials: true,
  //     },
  //   );
  // }

  async getReplies(
    commentId: string,
    page: number,
    limit: number,
    headers: any,
  ) {
    const cookie = headers.cookie;

    const response = await axios.get(
      `${this.baseUrl}/comments/replies/${commentId}?page=${page}&limit=${limit}`,
      {
        headers,
        withCredentials: true,
      },
    );

    const data = response.data;
    const replies = data.replies || [];

    if (!replies.length) {
      return response;
    }

    const userIds = [
      ...new Set(replies.map((r: any) => r.userId).filter(Boolean)),
    ];

    let users: any[] = [];

    if (userIds.length > 0) {
      const usersRes = await axios.get(
        `http://users-service:3002/profile/bulk`,
        {
          params: { ids: userIds.join(',') },
          headers: { cookie },
        },
      );

      users = usersRes.data || [];
    }

    const userMap = new Map(users.map((u: any) => [u.id, u]));

    const enrichedReplies = replies.map((r: any) => ({
      ...r,
      user: userMap.get(r.userId) || null,
    }));

    return {
      ...response,
      data: {
        ...data,
        replies: enrichedReplies,
      },
    };
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
