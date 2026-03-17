/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProfileService {
  private baseUrl = process.env.USERS_SERVICE_URL;

  async getMyProfile(headers: any) {
    return axios.get(`${this.baseUrl}/profile/me`, {
      headers,
      withCredentials: true,
    });
  }

  async getPublicProfile(id: string, headers: any) {
    return axios.get(`${this.baseUrl}/profile/${id}`, {
      headers,
      withCredentials: true,
    });
  }

  async updateProfile(data: any, headers: any) {
    return axios.patch(`${this.baseUrl}/profile`, data, {
      headers,
      withCredentials: true,
      timeout: 5000,
    });
  }

  async updateProfilePicture(file: any, headers: any) {
    return axios.patch(`${this.baseUrl}/profile/profile-picture`, file, {
      headers,
      withCredentials: true,
    });
  }

  async updateCoverPicture(file: any, headers: any) {
    return axios.patch(`${this.baseUrl}/profile/cover-picture`, file, {
      headers,
      withCredentials: true,
    });
  }
}
