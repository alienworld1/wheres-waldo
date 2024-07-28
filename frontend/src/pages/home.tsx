import { TailSpin } from 'react-loading-icons';

import { fetchPhotos, useFetch } from '../apis/backend-apis';
import { Photo } from '../types/models';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
  const { response, error, loading } = useFetch<never, Photo[]>(fetchPhotos);

  return (
    <main className="p-4 flex flex-col h-screen">
      <h1 className="text-center text-4xl mb-12">Photo Tagging App</h1>
      <div>
        {loading ? (
          <TailSpin />
        ) : error ? (
          <div className="text-red-600">{error.message}</div>
        ) : (
          <>
            <article className="flex-1 flex justify-center gap-2">
              {response?.map((data: Photo) => (
                <Link
                  className="flex flex-col max-w-sm px-4 py-3 gap-2 bg-blue-400 rounded shadow hover:scale-110 transition-transform duration-500 cursor-pointer"
                  key={data._id}
                  to={`/photo/${data.name}`}
                >
                  <img
                    src={`${apiUrl}/photo/${data.name}/preview`}
                    alt={data.name}
                  />
                  <p className="text-center font-medium text-lg">
                    {data.userFriendlyName}
                  </p>
                </Link>
              ))}
            </article>
            <hr className="w-full border-1 border-black mt-8 mb-4" />
            <aside className="flex flex-col items-center gap-8">
              <h2 className="text-center text-3xl">Leaderboards</h2>
              <nav className="flex justify-center gap-4">
                {response?.map(data => (
                  <Link
                    className="bg-blue-600 rounded shadow text-blue-50 px-4 py-2 hover:bg-blue-500 active:bg-blue-700"
                    to={`/leaderboard/${data.name}`}
                  >
                    {data.userFriendlyName}
                  </Link>
                ))}
              </nav>
            </aside>
          </>
        )}
      </div>
    </main>
  );
}

export default Home;
