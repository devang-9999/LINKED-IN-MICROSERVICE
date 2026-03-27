/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const findUser = async (credentials: any) => {
  console.log(credentials);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
};

export const createUser = async (credentials: any) => {
  console.log(credentials, "in api");

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
};

export const getUsers = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {

  const res = await fetch(
    `${API_BASE_URL}/users?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};

export const updateProfileApi = async (
  userid: string,
  formData: FormData
) => {
  const res = await fetch(
    `${API_BASE_URL}/users/profile`,
    {
      method: "PATCH",
      body: formData,
      credentials: "include",
    }
  );

  return res.json();
};
  

export const getCurrentUserApi = async (
  userid: string
) => {
  const res = await fetch(
    `${API_BASE_URL}/users/me`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }

  return res.json();
};