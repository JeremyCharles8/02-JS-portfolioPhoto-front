import { useState } from 'react';

import { errorSchema } from '../schemas/error.schema';
import { useQueryClient } from '@tanstack/react-query';

const apiUrl: string = import.meta.env.VITE_API_URL;

const fetchDeletePhoto = async (selectedPhoto: number[]) => {
  try {
    const response = await fetch(`${apiUrl}/photos/`, {
      method: 'DELETE',
      headers: {
        'Content-Types': 'application/json',
        credentials: 'include',
      },
      body: JSON.stringify(selectedPhoto),
    });

    if (!response.ok) {
      const errorData = errorSchema.parse(await response.json());
      return { status: response.status, error: errorData.error };
    }

    return { status: response.status, error: null };
  } catch (error) {
    console.log(error);
  }
};

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const deletePhoto = async (photoToDelete: number[]) => {
    setIsDeleting(true);
    const result = await fetchDeletePhoto(photoToDelete);
    if (result && result.error) {
      if (result.status === 500) {
        setError(
          "Une erreur c'est produite côté ServerRouter, si le problème persiste veuillez contacter l'administrateur"
        );
      }
      if (result.status === 404) {
        setError('Ressource introuvable');
      }
    } else {
      setSuccessMessage('Suppression réussie');
      queryClient.invalidateQueries({ queryKey: ['PhotoData'] });
    }
    setIsDeleting(false);
  };

  return { deletePhoto, errorDeletePhoto: error, isDeleting, successMessage };
};
