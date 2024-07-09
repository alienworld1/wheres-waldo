import { useEffect, useState } from 'react';
import { Photo } from '../types/models';

const apiUrl = import.meta.env.VITE_API_URL;

type Response = Photo[] | null;
type ApiCallback = (argument: unknown) => Promise<Response>;

interface FetchResponse {
  response: Response;
  error: Error | null;
  loading: boolean;
}

export const fetchPhotos: ApiCallback = async (): Promise<Photo[]> => {
  const response = await fetch(`${apiUrl}/photo`, { mode: 'cors' });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  } else {
    return data;
  }
};

export const useFetch = <Params>(
  callback: ApiCallback,
  argument?: Params,
): FetchResponse => {
  const [response, setResponse] = useState<Response>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setResponse(await callback(argument));
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
};
