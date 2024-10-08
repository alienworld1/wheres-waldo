import { useEffect, useState } from 'react';
import { Photo, User } from '../types/models';

const apiUrl = import.meta.env.VITE_API_URL;

type ApiCallback<argumentType, ResponseType> = (
  argument: argumentType,
) => Promise<ResponseType | null>;

interface FetchResponse<ResponseType> {
  response: ResponseType | null;
  error: Error | null;
  loading: boolean;
}

export const fetchPhotos: ApiCallback<never, Photo[]> = async (): Promise<
  Photo[]
> => {
  const response = await fetch(`${apiUrl}/photo`, { mode: 'cors' });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  } else {
    return data;
  }
};

export const getPhoto: ApiCallback<string, Photo> = async (
  photoName: string,
): Promise<Photo> => {
  const response = await fetch(`${apiUrl}/photo/${photoName}`, {
    mode: 'cors',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  } else {
    return data;
  }
};

export const fetchLeaderboard: ApiCallback<string, User[]> = async (
  photoName: string,
): Promise<User[]> => {
  const response = await fetch(`${apiUrl}/photo/${photoName}/leaderboard`, {
    mode: 'cors',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  } else {
    return data;
  }
};

export const createUser: ApiCallback<Photo, User> = async (photo: Photo) => {
  const response = await fetch(`${apiUrl}/user?photoid=${photo._id}`, {
    mode: 'cors',
    method: 'POST',
  });
  const user = await response.json();

  if (!response.ok) {
    throw new Error(user.message);
  } else {
    return user;
  }
};

export async function saveUser(name: string, user: User): Promise<void> {
  const reqBody = { name };

  const response = await fetch(`${apiUrl}/user/${user._id}`, {
    mode: 'cors',
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        data[0].msg ??
        'An error occured while saving user to leaderboard',
    );
  }
}

export async function recordTime(userId: string): Promise<void> {
  const response = await fetch(`${apiUrl}/user/${userId}/time`, {
    mode: 'cors',
    method: 'POST',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        data[0].msg ??
        'An error occured while saving user to leaderboard',
    );
  }
}
export function useFetch<Params, ResponseType>(
  callback: ApiCallback<Params, ResponseType>,
  argument?: Params,
): FetchResponse<ResponseType> {
  const [response, setResponse] = useState<ResponseType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setResponse(await callback(argument!));
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  });

  return { response, error, loading };
}
