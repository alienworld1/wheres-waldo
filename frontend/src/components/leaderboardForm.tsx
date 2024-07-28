import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { User } from '../types/models';
import { saveUser } from '../apis/backend-apis';

interface LeaderboardFormProps {
  user: User;
  photoName: string;
}

export default function LeaderboardForm({
  user,
  photoName,
}: LeaderboardFormProps) {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await saveUser(name, user);
      navigate(`/leaderboard/${photoName}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occured while saving user to leaderboard.',
      );
    }
  };

  return (
    <dialog className="rounded-lg shadow-xl backdrop:bg-gray-800 backdrop:bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-blue-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Save to Leaderboard
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Congratulations! You beat the game.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-400 focus:ring-opacity-50"
              required
              minLength={1}
              maxLength={32}
            />
          </div>
          <div className="mt-4 space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-gray-950 text-base font-medium rounded-md shadow-sm hover:bg-orange-400 focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
        {error && <p className="my-2 text-red-600">{error}</p>}
      </div>
    </dialog>
  );
}
