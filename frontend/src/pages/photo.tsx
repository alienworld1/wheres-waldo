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
import { createUser, getPhoto } from '../apis/backend-apis';
import { Photo, Position, User } from '../types/models';
import { TailSpin } from 'react-loading-icons';
import { differenceInMilliseconds } from 'date-fns';

import LeaderboardForm, {
  LeaderboardFormRef,
} from '../components/leaderboardForm';

import formatTime from '../utils/formatTime';

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
  const leaderboardFormRef = useRef<LeaderboardFormRef>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<Photo | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [elapsedTime, setElapsedTime] = useState<number>(0);

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
    if (response) {
      const userInit = async () => {
        try {
          const user = await createUser(response);
          setUser(user);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('An error occured'));
        }
      };

      userInit();
    }
  }, [response]);

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeDifference = differenceInMilliseconds(now, user.startTime);
        setElapsedTime(timeDifference);
      });

      return () => clearInterval(interval);
    }
  }, [user]);

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

    if (
      x - 15 < clientX &&
      clientX < x + 15 &&
      y - 15 < clientY &&
      clientY < y + 15
    ) {
      const newTargets = targets.filter(t => t.name != targetName);
      newTargets.push({ name: targetName, isFound: true });

      if (newTargets.filter(t => t.isFound === false).length === 0) {
        saveResults();
      }

      setTargets(newTargets);
    }
  };

  const saveResults = async () => {
    try {
      await fetch(`${apiUrl}/${user!._id}/save`, {
        method: 'POST',
      });
      leaderboardFormRef.current?.open();
    } catch {
      return;
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
              <div className="flex">
                <h2 className="mx-4">Time Elapsed:</h2>
                <p>{formatTime(elapsedTime)}</p>
              </div>
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
              {user && (
                <LeaderboardForm
                  ref={leaderboardFormRef}
                  user={user!}
                  photoName={photoName!}
                />
              )}
            </article>
          </>
        )}
      </div>
    </main>
  );
}

export default PhotoPage;
