/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SkillsService {
  private baseUrl = process.env.USERS_SERVICE_URL;

  async addSkill(data: any, headers: any) {
    return axios.post(`${this.baseUrl}/skills`, data, {
      headers,
      withCredentials: true,
    });
  }

  async getSkills(headers: any) {
    return axios.get(`${this.baseUrl}/skills`, {
      headers,
      withCredentials: true,
    });
  }

  async removeSkill(skillId: string, headers: any) {
    return axios.delete(`${this.baseUrl}/skills/${skillId}`, {
      headers,
      withCredentials: true,
    });
  }
}
