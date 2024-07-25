import formatTime from '../utils/formatTime';
import { User } from '../types/models';

interface EntryProps {
  index: number;
  user: User;
}

export default function Entry({ user, index }: EntryProps) {
  return (
    <tr className="even:bg-blue-200 bg-blue-100">
      <td className="py-2 px-4 border-b">{index + 1}</td>
      <td className="py-2 px-4 border-b">{user.name}</td>
      <td className="py-2 px-4 border-b">{formatTime(user.time)}</td>
    </tr>
  );
}
