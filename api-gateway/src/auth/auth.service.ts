import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  private authServiceUrl = process.env.AUTH_SERVICE_URL;

  async register(data: any) {
    const response = await axios.post(
      `${this.authServiceUrl}/auth/register`,
      data,
      { withCredentials: true },
    );

    return response;
  }

  async login(data: any) {
    const response = await axios.post(
      `${this.authServiceUrl}/auth/login`,
      data,
      { withCredentials: true },
    );

    return response;
  }

  async logout() {
    const response = await axios.post(
      `${this.authServiceUrl}/auth/logout`,
      {},
      { withCredentials: true },
    );

    return response;
  }

  async getById(id: string) {
    const response = await axios.get(`${this.authServiceUrl}/auth/${id}`, {
      withCredentials: true,
    });

    return response;
  }

  async deleteById(id: string) {
    const response = await axios.delete(`${this.authServiceUrl}/auth/${id}`, {
      withCredentials: true,
    });

    return response;
  }
}
