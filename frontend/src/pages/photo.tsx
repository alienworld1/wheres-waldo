import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch, getPhoto } from '../apis/backend-apis';
import { Photo, Position } from '../types/models';
import { TailSpin } from 'react-loading-icons';

const apiUrl: string = import.meta.env.VITE_API_URL;

const LazyImage = lazy(() => import('../components/lazyimage'));

interface ClientTarget {
  name: string;
  isFound: boolean;
}

interface CachedImages {
  [key: string]: string;
}

function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function PhotoPage() {
  const { photoName } = useParams();

  const [clickPosition, setClickPosition] = useState<Position | null>(null);
  const [targets, setTargets] = useState<ClientTarget[] | null>(null);
  const [cachedImages, setCachedImages] = useState<CachedImages>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { response, loading, error } = useFetch<string, Photo>(
    getPhoto,
    photoName,
  );

  useEffect(() => {
    if (response) {
      const imagesToCache = [
        `${apiUrl}/photo/${photoName}/main`,
        ...response.targets.map(
          t => `${apiUrl}/photo/${photoName}/targets/${t.name}`,
        ),
      ];

      imagesToCache.forEach(src => {
        const img = new Image();
        img.src = src;
        setCachedImages(prev => ({ ...prev, [src]: src }));
      });
    }
  }, [response, photoName]);

  useEffect(() => {
    if (response) {
      const targets: ClientTarget[] = response.targets.map(target => ({
        name: target.name,
        isFound: false,
      }));
      setTargets(targets);
    }
  }, [response]);

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;
    setClickPosition({ x, y });
  };

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
                  {response?.targets.map(target => (
                    <li key={target.name}>
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
              <div
                ref={containerRef}
                className="relative inline-block"
                onClick={handleImageClick}
              >
                <Suspense fallback={<TailSpin />}>
                  <LazyImage
                    src={
                      cachedImages[`${apiUrl}/photo/${photoName}/main`] ??
                      `${apiUrl}/photo/${photoName}/main`
                    }
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
                        {response?.targets.map(target => (
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
