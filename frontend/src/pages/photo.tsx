import React, {
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
  useMemo,
  useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import { getPhoto } from '../apis/backend-apis';
import { Photo, Position } from '../types/models';
import { TailSpin } from 'react-loading-icons';

const apiUrl: string = import.meta.env.VITE_API_URL;

const LazyImage = lazy(() => import('../components/lazyimage'));

interface ClientTarget {
  name: string;
  isFound: boolean;
}

function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function PhotoPage() {
  const { photoName } = useParams<{ photoName: string }>();

  const [clickPosition, setClickPosition] = useState<Position | null>(null);
  const [targets, setTargets] = useState<ClientTarget[] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<Photo | null>(null);

  const fetchPhoto = useCallback(async () => {
    if (!photoName) return null;
    try {
      setLoading(true);
      const data = await getPhoto(photoName);
      setResponse(data);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err : new Error('An error occured'));
      return null;
    }
  }, [photoName]);

  useEffect(() => {
    fetchPhoto();
  }, [fetchPhoto]);

  useEffect(() => {
    if (response) {
      const newTargets: ClientTarget[] = response.targets.map(target => ({
        name: target.name,
        isFound: false,
      }));
      setTargets(newTargets);
    }
  }, [response]);

  const mainImageUrl = useMemo(
    () => (photoName ? `${apiUrl}/photo/${photoName}/main` : null),
    [photoName],
  );

  const handleImageClick = useCallback(
    (event: React.MouseEvent<HTMLImageElement>) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();

      const x = event.clientX - containerRect.left;
      const y = event.clientY - containerRect.top;
      setClickPosition({ x, y });
    },
    [],
  );

  const handleDropdownClick = (event: React.MouseEvent<HTMLLIElement>) => {
    if (
      !dropdownRef.current ||
      !containerRef.current ||
      !clickPosition ||
      !response ||
      !targets
    )
      return;

    const { x, y } = clickPosition;

    const targetName = event.currentTarget.id;
    const target = response.targets.find(t => t.name === targetName);
    if (!target) return;

    const clientX =
      (target.position.x / response.width) * containerRef.current.clientWidth;
    const clientY =
      (target.position.y / response.height) * containerRef.current.clientHeight;

    console.log({ clientX, clientY });
    console.log({ x, y });

    if (
      x - 15 < clientX &&
      clientX < x + 15 &&
      y - 15 < clientY &&
      clientY < y + 15
    ) {
      const newTargets = targets.filter(t => t.name != targetName);
      newTargets.push({ name: targetName, isFound: true });
      setTargets(newTargets);
      console.log(newTargets);
    } else {
      console.log('Incorrect!');
    }
  };

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
                  {targets?.map(target => (
                    <li key={target.name} className="relative">
                      <img
                        src={`${apiUrl}/photo/${photoName}/targets/${target.name}`}
                        className={`w-16 h-16 ${target.isFound ? 'grayscale' : ''}`}
                      ></img>
                    </li>
                  ))}
                </ul>
              </div>
            </header>
            <article className="flex-1">
              <div
                ref={containerRef}
                className="relative inline-block"
                onClick={handleImageClick}
              >
                <Suspense fallback={<TailSpin />}>
                  <LazyImage
                    src={mainImageUrl!}
                    alt={response?.userFriendlyName}
                    className="cursor-pointer max-w-full block"
                  />
                </Suspense>
                {clickPosition && (
                  <>
                    <div
                      className="absolute w-[30px] h-[30px] bg-red-600 opacity-50 pointer-events-none"
                      style={{
                        left: `${clickPosition.x - 15}px`,
                        top: `${clickPosition.y - 15}px`,
                      }}
                    ></div>
                    <div
                      className="absolute p-2 bg-gray-900 text-gray-50 rounded shadow"
                      style={{
                        left: `${clickPosition.x + 20}px`,
                        top: `${clickPosition.y - 15}px`,
                      }}
                      ref={dropdownRef}
                    >
                      <ul className="list-none">
                        {targets!
                          .filter(t => t.isFound === false)
                          .map(target => (
                            <li
                              key={target.name}
                              className="px-4 py-2 hover:bg-gray-500 cursor-pointer transition-colors"
                              id={target.name}
                              onClick={handleDropdownClick}
                            >
                              <img
                                src={`${apiUrl}/photo/${photoName}/targets/${target.name}`}
                                alt={response?.userFriendlyName}
                                className="w-8 h-8 inline"
                              />
                              <span className="ml-2 text-lg">
                                {capitalizeString(target.name)}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </article>
          </>
        )}
      </div>
    </main>
  );
}

export default PhotoPage;
