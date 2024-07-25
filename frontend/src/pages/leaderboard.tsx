import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TailSpin } from 'react-loading-icons';

import Entry from '../components/entry';
import { fetchLeaderboard } from '../apis/backend-apis';
import { User } from '../types/models';

export default function Leaderboard() {
  const { photoName } = useParams<{ photoName: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);

  useEffect(() => {
    if (!photoName) return;

    setLoading(true);
    fetchLeaderboard(photoName)
      .then(data => {
        setLeaderboard(data ?? []);
        console.log(data);
      })
      .catch(err => {
        setError(err instanceof Error ? err : new Error('An error occured'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [photoName]);

  return (
    <main className="flex flex-col h-screen">
      {loading ? (
        <TailSpin />
      ) : error ? (
        <div className="text-red-600">{error.message}</div>
      ) : (
        leaderboard && (
          <>
            <header className="bg-blue-400 p-4 text-2xl font-semibold">
              Leaderboard
            </header>
            <div className="flex-1 flex justify-center items-center">
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="bg-blue-300">
                      <th className="py-2 px-4 border-b text-left">Rank</th>
                      <th className="py-2 px-4 border-b text-left">Username</th>
                      <th className="py-2 px-4 border-b text-left">Time</th>
                    </tr>
                  </thead>
                  {leaderboard.map((user, index) => (
                    <Entry key={user._id} user={user} index={index} />
                  ))}
                </table>
              </div>
            </div>
          </>
        )
      )}
    </main>
  );
}
