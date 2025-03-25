import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { errorSchema } from '../schemas/error.schema';

const apiUrl: string = import.meta.env.VITE_API_URL;

const fetchAddPhoto = async (formData) => {
  try {
    const response = await fetch(`${apiUrl}/photos/`, {
      method: 'POST',
      headers: {
        'Content-Types': 'application/json',
        credentials: 'include',
      },
      body: JSON.stringify(formData),
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

export const useAddPhoto = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  //TODO formData type
  const addPhoto = async (formData) => {
    const result = await fetchAddPhoto(formData);
    setIsAdding(true);
    if (result && result.error) {
      if (result.status === 500) {
        setError(
          "Une erreur est suvenue côté serveur, si l'erreur persiste veuillez contacter l'administrateur"
        );
      }
      if (result.status === 404) {
        setError('Ressource Introuvable');
      }
    } else {
      setSuccessMessage('Photo ajoutée avec succés');
      queryClient.invalidateQueries({ queryKey: ['PhotoData'] });
    }
    setIsAdding(false);
  };

  return { addPhoto, errorAddPhoto: error, isAdding, successMessage };
};
