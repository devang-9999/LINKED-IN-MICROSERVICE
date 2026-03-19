import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});


export const followUser = async (userId: string) => {
  return API.post(`/users/followers/${userId}`);
};

export const unfollowUser = async (userId: string) => {
  return API.delete(`/users/followers/${userId}`);
};

export const getFollowersCount = async (userId: string) => {
  return API.get(`/users/followers/${userId}`);
};

export const getFollowStatus = async (userId: string) => {
  return API.get(`/users/followers/status/${userId}`);
};


export const toggleConnection = async (userId: string) => {
  return API.post(`/users/connections/request/${userId}`);
};

export const getConnectionStatus = async (userId: string) => {
  return API.get(`/users/connections/status/${userId}`);
};

export const getReceivedRequests = async () => {
  return API.get(`/users/connections/requests`);
};

export const getSentRequests = async () => {
  return API.get(`/users/connections/sent`);
};

export const acceptConnection = async (connectionId: string) => {
  return API.post(`/users/connections/accept/${connectionId}`);
};

export const rejectConnection = async (connectionId: string) => {
  return API.post(`/users/connections/reject/${connectionId}`);
};

export const getConnections = async () => {
  return API.get(`/users/connections`);
};

export const getMyConnectionsCount = async () => {
  return API.get(`/users/connections/count`);
};

export const getMyFollowingCount = async () => {
  return API.get(`/users/followers/following/count`);
};

export const getSentRequestsCount = async () => {
  return API.get(`/users/connections/sent/count`);
};