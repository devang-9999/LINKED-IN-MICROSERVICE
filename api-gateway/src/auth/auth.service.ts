/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  private authServiceUrl = process.env.AUTH_SERVICE_URL;

  async register(data: any, headers: any) {
    return axios.post(`${this.authServiceUrl}/auth/register`, data, {
      headers,
      withCredentials: true,
    });
  }

  async login(data: any, headers: any) {
    return axios.post(`${this.authServiceUrl}/auth/login`, data, {
      headers,
      withCredentials: true,
    });
  }

  async logout(headers: any) {
    return axios.post(
      `${this.authServiceUrl}/auth/logout`,
      {},
      {
        headers,
        withCredentials: true,
      },
    );
  }

  async getById(id: string, headers: any) {
    return axios.get(`${this.authServiceUrl}/auth/${id}`, {
      headers,
      withCredentials: true,
    });
  }

  async deleteById(id: string, headers: any) {
    return axios.delete(`${this.authServiceUrl}/auth/${id}`, {
      headers,
      withCredentials: true,
    });
  }
}
