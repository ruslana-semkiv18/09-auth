import { api } from "./api";
import type { Note, NoteFormValues } from "@/types/note";
import type { User } from "@/types/user";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

// AUTH
export const register = async (data: { email: string; password: string }) => {
  const { data: res } = await api.post<User>("/auth/register", data);
  return res;
};

export const login = async (data: { email: string; password: string }) => {
  const { data: res } = await api.post<User>("/auth/login", data);
  return res;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<User>("/auth/session");
    return data;
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (user: { username: string; email: string }) => {
  const { data } = await api.patch<User>("/users/me", user);
  return data;
};

// NOTES
export const fetchNotes = async (
  search: string,
  page: number = 1,
  perPage: number = 12,
  tag?: string,
): Promise<NotesResponse> => {
  const { data } = await api.get<NotesResponse>("/notes", {
    params: {
      search,
      page,
      perPage,
      ...(tag && tag !== "all" && { tag }),
    },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: NoteFormValues): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
