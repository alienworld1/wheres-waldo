import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch, getPhoto } from '../apis/backend-apis';
import { Photo, Position } from '../types/models';
import { TailSpin } from 'react-loading-icons';

const apiUrl = import.meta.env.VITE_API_URL;

function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function PhotoPage() {
  const { photoName } = useParams();

  const [clickPosition, setClickPosition] = useState<Position | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { response, loading, error } = useFetch<string, Photo>(
    getPhoto,
    photoName,
  );

  const boxSize = 30;

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;
    setClickPosition({ x, y });

    const halfBox = boxSize / 2;
    const corners = {
      topLeft: { x: x - halfBox, y: y - halfBox },
      topRight: { x: x + halfBox, y: y - halfBox },
      bottomLeft: { x: x - halfBox, y: y + halfBox },
      bottomRight: { x: x + halfBox, y: y + halfBox },
    };

    console.log(corners);
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
                onClick={handleClick}
              >
                <img
                  src={`${apiUrl}/photo/${photoName}/main`}
                  alt={response?.userFriendlyName}
                  className="cursor-pointer max-w-full block"
                />
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
                    >
                      <ul className="list-none">
                        {response?.targets.map(target => (
                          <li
                            key={target.name}
                            className="px-4 py-2 hover:bg-gray-500 cursor-pointer transition-colors"
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
