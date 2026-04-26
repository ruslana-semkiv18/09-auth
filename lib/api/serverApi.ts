import axios from "axios";
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

const createServerApi = async () => {
  const cookieStore = await cookies();

  return axios.create({
    baseURL,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
};

// AUTH
export const checkSessionServer = async () => {
  const api = await createServerApi();
  const res = await api.get("/auth/session");
  return res;
};

export const getMeServer = async (): Promise<User> => {
  const api = await createServerApi();
  const { data } = await api.get<User>("/users/me");
  return data;
};

// NOTES
export const fetchNotesServer = async (
  search: string,
  page: number = 1,
  perPage: number = 12,
  tag?: string,
): Promise<NotesResponse> => {
  const api = await createServerApi();

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

export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  const api = await createServerApi();
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};
