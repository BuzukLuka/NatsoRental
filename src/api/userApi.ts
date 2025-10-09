import api from "./client";
import { User } from "../types";

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get("/users");
  return data;
};

export const getUserById = async (id: string): Promise<User> => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};
