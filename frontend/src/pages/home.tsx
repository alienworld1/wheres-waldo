import { TailSpin } from 'react-loading-icons';

import { fetchPhotos, useFetch } from '../apis/backend-apis';
import { Photo } from '../types/models';

function Home() {
  const { response, error, loading } = useFetch(fetchPhotos);

  return (
    <div>
      {loading ? (
        <TailSpin />
      ) : error ? (
        <div>{error.message}</div>
      ) : (
        response?.map((data: Photo) => (
          <li key={data._id}>{data.userFriendlyName}</li>
        ))
      )}
    </div>
  );
}

export default Home;
