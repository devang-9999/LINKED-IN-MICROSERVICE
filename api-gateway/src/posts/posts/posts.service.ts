/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PostsService {
  private baseUrl = process.env.POSTS_SERVICE_URL;

  // async getAllPosts(headers: any) {
  //   const response = await axios.get(`${this.baseUrl}/posts`, {
  //     headers,
  //     withCredentials: true,
  //   });

  //   return response;
  // }

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

  async getAllPosts(req: any) {
    try {
      const cookie = req.headers.cookie;

      const postsResponse = await axios.get(`http://posts-service:3003/posts`, {
        headers: {
          cookie,
        },
      });

      const posts = postsResponse.data?.posts || [];

      if (!posts.length) {
        return {
          posts: [],
          total: 0,
          page: 1,
          limit: 10,
        };
      }
      const userIds = [
        ...new Set(posts.map((p: any) => p.userId).filter(Boolean)),
      ];

      let users: any[] = [];

      if (userIds.length > 0) {
        const usersResponse = await axios.get(
          `http://users-service:3002/profile/bulk`,
          {
            params: { ids: userIds.join(',') },
            headers: {
              cookie,
            },
          },
        );
        users = usersResponse.data || [];
      }

      const userMap = new Map(users.map((u: any) => [u.id, u]));
      const enrichedPosts = posts.map((post: any) => ({
        ...post,
        user: userMap.get(post.userId) || null,
      }));

      return {
        posts: enrichedPosts,
        total: postsResponse.data?.total || 0,
        page: postsResponse.data?.page || 1,
        limit: postsResponse.data?.limit || 10,
      };
    } catch (error) {
      console.error(' getAllPosts error:', error?.response?.data || error);

      throw new Error('Failed to fetch posts');
    }
  }
  // async getAllPosts(headers: any) {
  //   const postsResponse = await axios.get(`${this.baseUrl}/posts`, {
  //     headers,
  //     withCredentials: true,
  //   });

  //   const posts = postsResponse.data.posts;

  //   const userIds = [...new Set(posts.map((p: any) => p.userId))];

  //   const usersResponse = await axios.get(
  //     `${process.env.USERS_SERVICE_URL}/users/bulk?ids=${userIds.join(',')}`,
  //     {
  //       headers,
  //       withCredentials: true,
  //     },
  //   );

  //   const users = usersResponse.data;

  //   const userMap = new Map(users.map((u: any) => [u.id, u]));

  //   const enrichedPosts = posts.map((post: any) => ({
  //     ...post,
  //     user: userMap.get(post.userId) || null,
  //   }));

  //   return {
  //     posts: enrichedPosts,
  //     total: postsResponse.data.total,
  //     page: postsResponse.data.page,
  //     limit: postsResponse.data.limit,
  //   };
  // }
}
