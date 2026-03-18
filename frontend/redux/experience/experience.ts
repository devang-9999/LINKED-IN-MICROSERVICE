/* eslint-disable @typescript-eslint/no-explicit-any */
import API from "@/utils/axios";

export const createExperience = (data: any) =>
  API.post("/users/experience", data);

export const getExperiences = () =>
  API.get("/users/experience");

export const updateExperience = (id: string, data: any) =>
  API.patch(`/users/experience/${id}`, data);

export const deleteExperience = (id: string) =>
  API.delete(`/users/experience/${id}`);