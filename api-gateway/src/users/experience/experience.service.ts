/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExperienceService {
  private baseUrl = process.env.USERS_SERVICE_URL;

  async create(data: any, headers: any) {
    return axios.post(`${this.baseUrl}/experience`, data, {
      headers,
      withCredentials: true,
    });
  }

  async getAll(headers: any) {
    return axios.get(`${this.baseUrl}/experience`, {
      headers,
      withCredentials: true,
    });
  }

  async update(id: string, data: any, headers: any) {
    return axios.patch(`${this.baseUrl}/experience/${id}`, data, {
      headers,
      withCredentials: true,
    });
  }

  async remove(id: string, headers: any) {
    return axios.delete(`${this.baseUrl}/experience/${id}`, {
      headers,
      withCredentials: true,
    });
  }
}
