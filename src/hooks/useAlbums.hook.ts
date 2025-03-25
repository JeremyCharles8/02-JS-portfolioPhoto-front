import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { errorSchema } from '../schemas/error.schema';
import { albumSchema } from '../schemas/album.schema';
import { AlbumList } from '../@types/album.type';

const apiUrl: string = import.meta.env.VITE_API_URL;

const getAlbumName = async () => {
  try {
    const response = await fetch(`${apiUrl}/albums/`, {
      method: 'GET',
      headers: {
        credentials: 'include',
      },
    });
    if (!response.ok) {
      const errorData = errorSchema.parse(await response.json());
      return { status: response.status, error: errorData.error, data: null };
    }

    const data = albumSchema.parse(await response.json());

    return { status: response.status, error: null, data };
  } catch (error) {
    console.log(error);
  }
};

export const useAlbums = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [albums, setAlbums] = useState<AlbumList>([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      const albums = await getAlbumName();
      if (albums && albums.error) {
        if (albums.status === 401) {
          navigate('/auth');
        } else {
          setError(albums.status);
        }
      }
      if (albums && albums.data) {
        setAlbums(albums.data);
        setIsLoading(false);
      }
    };

    fetchAlbums();
  });

  return { albums, isloadingAlbum: isLoading, errorAlbum: error };
};
