import { useParams } from 'react-router-dom';
import { useFetch, getPhoto } from '../apis/backend-apis';
import { Photo } from '../types/models';
import { TailSpin } from 'react-loading-icons';

const apiUrl = import.meta.env.VITE_API_URL;

function PhotoPage() {
  const { photoName } = useParams();

  const { response, loading, error } = useFetch<string, Photo>(
    getPhoto,
    photoName,
  );

  return (
    <main className="flex flex-col h-screen">
      <div>
        {loading ? (
          <TailSpin />
        ) : error ? (
          <div className="text-red-600">{error.message}</div>
        ) : (
          <>
            <header className="bg-blue-400 py-4 px-12 text-2xl font-semibold flex justify-between items-center">
              <h1>{response?.userFriendlyName}</h1>
              <div className="flex items-center">
                <h2 className="mx-4">Targets: </h2>
                <ul className="flex gap-4">
                  {response?.targets.map(target => (
                    <li>
                      <img
                        src={`${apiUrl}/photo/${photoName}/targets/${target.name}`}
                        className="w-16 h-16"
                      ></img>
                    </li>
                  ))}
                </ul>
              </div>
            </header>
            <article className="flex-1">
              <img
                src={`${apiUrl}/photo/${photoName}/main`}
                alt={response?.userFriendlyName}
              />
            </article>
          </>
        )}
      </div>
    </main>
  );
}

export default PhotoPage;
