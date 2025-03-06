import { useQuery } from '@tanstack/react-query';

import { metaDataSchema } from '../schemas/photo.shcema';
import { errorSchema } from '../schemas/error.schema';
import { MetaData } from '../@types/photo.type';

const apiUrl: string = import.meta.env.VITE_API_URL;

const getAllPhotos = async () => {
  const response = await fetch(`${apiUrl}/photos/meta-data`, {
    method: 'GET',
    headers: {
      credentials: 'include',
    },
  });
  if (!response.ok) {
    const errorData = errorSchema.parse(await response.json());
    throw new Error(errorData.error);
  }

  const photosData: MetaData = await response.json();

  return metaDataSchema.parse(photosData);
};

export const usePhotoMetaData = () => {
  return useQuery({
    queryKey: ['PhotoData'],
    queryFn: getAllPhotos,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 15,
  });
};
