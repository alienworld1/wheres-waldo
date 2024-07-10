import { TailSpin } from 'react-loading-icons';

import { fetchPhotos, useFetch } from '../apis/backend-apis';
import { Photo } from '../types/models';

const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
  const { response, error, loading } = useFetch(fetchPhotos);

  return (
    <main className="p-4 flex flex-col h-screen">
      <h1 className="text-center text-4xl mb-16">Photo Tagging App</h1>
      <div>
        {loading ? (
          <TailSpin />
        ) : error ? (
          <div className="text-red-600">{error.message}</div>
        ) : (
          <article className="flex-1 flex justify-center gap-2">
            {response?.map((data: Photo) => (
              <div
                className="flex flex-col max-w-sm px-4 py-3 gap-2 bg-blue-400 rounded shadow hover:scale-110 transition-transform duration-500 cursor-pointer"
                key={data._id}
              >
                <img
                  src={`${apiUrl}/photo/${data.name}/preview`}
                  alt={data.name}
                />
                <p className="text-center font-medium text-lg">
                  {data.userFriendlyName}
                </p>
              </div>
            ))}
          </article>
        )}
      </div>
    </main>
  );
}

export default Home;
