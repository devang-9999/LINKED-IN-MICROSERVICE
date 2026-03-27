/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RepostsService {
  private postsServiceUrl = process.env.POSTS_SERVICE_URL;
  private usersServiceUrl = process.env.USERS_SERVICE_URL;

  async createRepost(postId: string, body: any, headers: any) {
    return axios.post(`${this.postsServiceUrl}/reposts/${postId}`, body, {
      headers,
      withCredentials: true,
    });
  }

  async getAllReposts(page: number, limit: number, req: any) {
    try {
      const cookie = req.headers.cookie;

      const repostResponse = await axios.get(
        `${this.postsServiceUrl}/reposts?page=${page}&limit=${limit}`,
        {
          headers: { cookie },
        },
      );

      const reposts = repostResponse.data?.reposts || [];

      if (!reposts.length) {
        return {
          reposts: [],
          total: 0,
          page,
          limit,
        };
      }

      const userIds = [
        ...new Set(
          reposts
            .flatMap((r: any) => [r.userId, r.post?.userId])
            .filter(Boolean),
        ),
      ];

      let users: any[] = [];

      if (userIds.length > 0) {
        const usersResponse = await axios.get(
          `${this.usersServiceUrl}/profile/bulk`,
          {
            params: { ids: userIds.join(',') },
            headers: { cookie },
          },
        );

        users = usersResponse.data || [];
      }

      const userMap = new Map(users.map((u: any) => [u.id, u]));

      const enrichedReposts = reposts.map((r: any) => ({
        ...r,

        user: userMap.get(r.userId) || null,

        post: {
          ...r.post,
          user: userMap.get(r.post?.userId) || null,
        },
      }));

      return {
        reposts: enrichedReposts,
        total: repostResponse.data?.total || 0,
        page: repostResponse.data?.page || page,
        limit: repostResponse.data?.limit || limit,
      };
    } catch (error) {
      console.error('getAllReposts error:', error?.response?.data || error);
      throw new Error('Failed to fetch reposts');
    }
  }

  async getRepostsByPost(
    postId: string,
    page: number,
    limit: number,
    req: any,
  ) {
    try {
      const cookie = req.headers.cookie;

      const repostResponse = await axios.get(
        `${this.postsServiceUrl}/reposts/post/${postId}?page=${page}&limit=${limit}`,
        {
          headers: { cookie },
        },
      );

      const reposts = repostResponse.data?.reposts || [];

      const userIds = [
        ...new Set(
          reposts
            .flatMap((r: any) => [r.userId, r.post?.userId])
            .filter(Boolean),
        ),
      ];

      let users: any[] = [];

      if (userIds.length > 0) {
        const usersResponse = await axios.get(
          `${this.usersServiceUrl}/profile/bulk`,
          {
            params: { ids: userIds.join(',') },
            headers: { cookie },
          },
        );

        users = usersResponse.data || [];
      }

      const userMap = new Map(users.map((u: any) => [u.id, u]));

      const enrichedReposts = reposts.map((r: any) => ({
        ...r,
        user: userMap.get(r.userId) || null,
        post: {
          ...r.post,
          user: userMap.get(r.post?.userId) || null,
        },
      }));

      return {
        reposts: enrichedReposts,
        total: repostResponse.data?.total || 0,
        page,
        limit,
      };
    } catch (error) {
      console.error('getRepostsByPost error:', error?.response?.data || error);
      throw new Error('Failed to fetch reposts by post');
    }
  }

  async deleteRepost(postId: string, headers: any) {
    return axios.delete(`${this.postsServiceUrl}/reposts/${postId}`, {
      headers,
      withCredentials: true,
    });
  }
}
