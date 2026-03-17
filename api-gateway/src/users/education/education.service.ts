/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EducationService {
  private baseUrl = process.env.USERS_SERVICE_URL;

  async create(data: any, headers: any) {
    return axios.post(`${this.baseUrl}/education`, data, {
      headers,
      withCredentials: true,
    });
  }

  async getAll(headers: any) {
    return axios.get(`${this.baseUrl}/education`, {
      headers,
      withCredentials: true,
    });
  }

  async update(id: string, data: any, headers: any) {
    return axios.patch(`${this.baseUrl}/education/${id}`, data, {
      headers,
      withCredentials: true,
    });
  }

  async remove(id: string, headers: any) {
    return axios.delete(`${this.baseUrl}/education/${id}`, {
      headers,
      withCredentials: true,
    });
  }
}
